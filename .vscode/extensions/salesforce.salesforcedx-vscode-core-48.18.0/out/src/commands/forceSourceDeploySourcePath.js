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
const path = require("path");
const vscode = require("vscode");
const channels_1 = require("../channels");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const settings_1 = require("../settings");
const telemetry_1 = require("../telemetry");
const baseDeployCommand_1 = require("./baseDeployCommand");
const forceSourceRetrieveSourcePath_1 = require("./forceSourceRetrieveSourcePath");
const metadataTypeConstants_1 = require("./templates/metadataTypeConstants");
const util_1 = require("./util");
const libraryCommandlet_1 = require("./util/libraryCommandlet");
class ForceSourceDeploySourcePathExecutor extends baseDeployCommand_1.BaseDeployExecutor {
    build(sourcePath) {
        const commandBuilder = new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_source_deploy_text'))
            .withArg('force:source:deploy')
            .withLogName('force_source_deploy_with_sourcepath')
            .withFlag('--sourcepath', sourcePath)
            .withJson();
        return commandBuilder.build();
    }
    getDeployType() {
        return baseDeployCommand_1.DeployType.Deploy;
    }
}
exports.ForceSourceDeploySourcePathExecutor = ForceSourceDeploySourcePathExecutor;
class MultipleSourcePathsGatherer {
    constructor(uris) {
        this.uris = uris;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const sourcePaths = this.uris.map(uri => uri.fsPath).join(',');
            return {
                type: 'CONTINUE',
                data: sourcePaths
            };
        });
    }
}
exports.MultipleSourcePathsGatherer = MultipleSourcePathsGatherer;
function forceSourceDeploySourcePath(sourceUri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!sourceUri) {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId !== 'forcesourcemanifest') {
                sourceUri = editor.document.uri;
            }
            else {
                const errorMessage = messages_1.nls.localize('force_source_deploy_select_file_or_directory');
                telemetry_1.telemetryService.sendException('force_source_deploy_with_sourcepath', errorMessage);
                notifications_1.notificationService.showErrorMessage(errorMessage);
                channels_1.channelService.appendLine(errorMessage);
                channels_1.channelService.showChannelOutput();
                return;
            }
        }
        const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), new util_1.FilePathGatherer(sourceUri), useBetaRetrieve([sourceUri])
            ? new LibraryDeploySourcePathExecutor()
            : new ForceSourceDeploySourcePathExecutor(), new forceSourceRetrieveSourcePath_1.SourcePathChecker());
        yield commandlet.run();
    });
}
exports.forceSourceDeploySourcePath = forceSourceDeploySourcePath;
function forceSourceDeployMultipleSourcePaths(uris) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), new MultipleSourcePathsGatherer(uris), useBetaRetrieve(uris)
            ? new LibraryDeploySourcePathExecutor()
            : new ForceSourceDeploySourcePathExecutor());
        yield commandlet.run();
    });
}
exports.forceSourceDeployMultipleSourcePaths = forceSourceDeployMultipleSourcePaths;
// this supported types logic is temporary until we have a way of generating the metadata type from the path
// once we have the metadata type we can check to see if it is a toolingsupportedtype from that util
function useBetaRetrieve(explorerPath) {
    if (explorerPath.length > 1) {
        return false;
    }
    const filePath = explorerPath[0].fsPath;
    const betaDeployRetrieve = settings_1.sfdxCoreSettings.getBetaDeployRetrieve();
    const supportedType = path.extname(filePath) === metadataTypeConstants_1.APEX_CLASS_EXTENSION ||
        filePath.includes(`${metadataTypeConstants_1.APEX_CLASS_EXTENSION}-meta.xml`) ||
        (path.extname(filePath) === metadataTypeConstants_1.APEX_TRIGGER_EXTENSION ||
            filePath.includes(`${metadataTypeConstants_1.APEX_TRIGGER_EXTENSION}-meta.xml`)) ||
        (path.extname(filePath) === metadataTypeConstants_1.VISUALFORCE_COMPONENT_EXTENSION ||
            filePath.includes(`${metadataTypeConstants_1.VISUALFORCE_COMPONENT_EXTENSION}-meta.xml`)) ||
        (path.extname(filePath) === metadataTypeConstants_1.VISUALFORCE_PAGE_EXTENSION ||
            filePath.includes(`${metadataTypeConstants_1.VISUALFORCE_PAGE_EXTENSION}-meta.xml`));
    return betaDeployRetrieve && supportedType;
}
exports.useBetaRetrieve = useBetaRetrieve;
class LibraryDeploySourcePathExecutor extends libraryCommandlet_1.LibraryCommandletExecutor {
    execute(response) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStartTime();
            try {
                yield this.build('Deploy (Beta)', 'force_source_deploy_with_sourcepath_beta');
                if (this.sourceClient === undefined) {
                    throw new Error('SourceClient is not established');
                }
                this.sourceClient.tooling.deployWithPaths = this.deployWrapper(this.sourceClient.tooling.deployWithPaths);
                yield this.sourceClient.tooling.deployWithPaths({
                    paths: [response.data]
                });
                this.logMetric();
            }
            catch (e) {
                telemetry_1.telemetryService.sendException('force_source_deploy_with_sourcepath_beta', e.message);
                notifications_1.notificationService.showFailedExecution(this.executionName);
                channels_1.channelService.appendLine(e.message);
            }
            finally {
                yield settings_1.DeployQueue.get().unlock();
            }
        });
    }
}
exports.LibraryDeploySourcePathExecutor = LibraryDeploySourcePathExecutor;
//# sourceMappingURL=forceSourceDeploySourcePath.js.map