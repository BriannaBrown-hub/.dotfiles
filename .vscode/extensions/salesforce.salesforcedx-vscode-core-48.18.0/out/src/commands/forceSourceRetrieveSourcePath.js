"use strict";
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const source_deploy_retrieve_1 = require("@salesforce/source-deploy-retrieve");
const vscode = require("vscode");
const channels_1 = require("../channels");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const settings_1 = require("../settings");
const sfdxProject_1 = require("../sfdxProject");
const telemetry_1 = require("../telemetry");
const util_1 = require("./util");
const libraryCommandlet_1 = require("./util/libraryCommandlet");
class ForceSourceRetrieveSourcePathExecutor extends util_1.SfdxCommandletExecutor {
    build(sourcePath) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_source_retrieve_text'))
            .withArg('force:source:retrieve')
            .withFlag('--sourcepath', sourcePath)
            .withLogName('force_source_retrieve_with_sourcepath')
            .build();
    }
}
exports.ForceSourceRetrieveSourcePathExecutor = ForceSourceRetrieveSourcePathExecutor;
class SourcePathChecker {
    check(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (inputs.type === 'CONTINUE') {
                const sourcePath = inputs.data;
                try {
                    const isInSfdxPackageDirectory = yield sfdxProject_1.SfdxPackageDirectories.isInPackageDirectory(sourcePath);
                    if (isInSfdxPackageDirectory) {
                        return inputs;
                    }
                }
                catch (error) {
                    telemetry_1.telemetryService.sendException('force_source_retrieve_with_sourcepath', `Error while parsing package directories. ${error.message}`);
                }
                const errorMessage = messages_1.nls.localize('error_source_path_not_in_package_directory_text');
                telemetry_1.telemetryService.sendException('force_source_retrieve_with_sourcepath', errorMessage);
                notifications_1.notificationService.showErrorMessage(errorMessage);
                channels_1.channelService.appendLine(errorMessage);
                channels_1.channelService.showChannelOutput();
            }
            return { type: 'CANCEL' };
        });
    }
}
exports.SourcePathChecker = SourcePathChecker;
function forceSourceRetrieveSourcePath(explorerPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!explorerPath) {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId !== 'forcesourcemanifest') {
                explorerPath = editor.document.uri;
            }
            else {
                const errorMessage = messages_1.nls.localize('force_source_retrieve_select_file_or_directory');
                telemetry_1.telemetryService.sendException('force_source_retrieve_with_sourcepath', errorMessage);
                notifications_1.notificationService.showErrorMessage(errorMessage);
                channels_1.channelService.appendLine(errorMessage);
                channels_1.channelService.showChannelOutput();
                return;
            }
        }
        const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), new util_1.FilePathGatherer(explorerPath), useBetaRetrieve(explorerPath)
            ? new LibraryRetrieveSourcePathExecutor()
            : new ForceSourceRetrieveSourcePathExecutor(), new SourcePathChecker());
        yield commandlet.run();
    });
}
exports.forceSourceRetrieveSourcePath = forceSourceRetrieveSourcePath;
// this supported types logic is temporary until we have a way of generating the metadata type from the path
// once we have the metadata type we can check to see if it is a toolingsupportedtype from that util
function useBetaRetrieve(explorerPath) {
    const filePath = explorerPath.fsPath;
    const betaDeployRetrieve = settings_1.sfdxCoreSettings.getBetaDeployRetrieve();
    const registry = new source_deploy_retrieve_1.RegistryAccess();
    const component = registry.getComponentsFromPath(filePath)[0];
    const typeName = component.type.name;
    const { auradefinitionbundle, lightningcomponentbundle, apexclass, apexcomponent, apexpage, apextrigger } = source_deploy_retrieve_1.registryData.types;
    const supportedType = typeName === auradefinitionbundle.name ||
        typeName === lightningcomponentbundle.name ||
        typeName === apexclass.name ||
        typeName === apexcomponent.name ||
        typeName === apexpage.name ||
        typeName === apextrigger.name;
    return betaDeployRetrieve && supportedType;
}
exports.useBetaRetrieve = useBetaRetrieve;
class LibraryRetrieveSourcePathExecutor extends libraryCommandlet_1.LibraryCommandletExecutor {
    execute(response) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStartTime();
            try {
                yield this.build('Retrieve (Beta)', 'force_source_retrieve_with_sourcepath_beta');
                if (this.sourceClient === undefined) {
                    throw new Error('SourceClient is not established');
                }
                this.sourceClient.tooling.retrieveWithPaths = this.retrieveWrapper(this.sourceClient.tooling.retrieveWithPaths);
                const retrieveOpts = {
                    paths: [response.data]
                };
                yield this.sourceClient.tooling.retrieveWithPaths(retrieveOpts);
                this.logMetric();
            }
            catch (e) {
                telemetry_1.telemetryService.sendException('force_source_retrieve_with_sourcepath_beta', e.message);
                notifications_1.notificationService.showFailedExecution(this.executionName);
                channels_1.channelService.appendLine(e.message);
            }
        });
    }
}
exports.LibraryRetrieveSourcePathExecutor = LibraryRetrieveSourcePathExecutor;
//# sourceMappingURL=forceSourceRetrieveSourcePath.js.map