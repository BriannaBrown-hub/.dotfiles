"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const vscode = require("vscode");
const channels_1 = require("../channels");
const postconditionCheckers_1 = require("../commands/util/postconditionCheckers");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const telemetry_1 = require("../telemetry");
const baseDeployCommand_1 = require("./baseDeployCommand");
const util_1 = require("./util");
class ForceSourceDeployManifestExecutor extends baseDeployCommand_1.BaseDeployExecutor {
    build(manifestPath) {
        const commandBuilder = new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_source_deploy_text'))
            .withArg('force:source:deploy')
            .withLogName('force_source_deploy_with_manifest')
            .withFlag('--manifest', manifestPath)
            .withJson();
        return commandBuilder.build();
    }
    getDeployType() {
        return baseDeployCommand_1.DeployType.Deploy;
    }
}
exports.ForceSourceDeployManifestExecutor = ForceSourceDeployManifestExecutor;
function forceSourceDeployManifest(manifestUri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!manifestUri) {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'forcesourcemanifest') {
                manifestUri = editor.document.uri;
            }
            else {
                const errorMessage = messages_1.nls.localize('force_source_deploy_select_manifest');
                telemetry_1.telemetryService.sendException('force_source_deploy_with_manifest', errorMessage);
                notifications_1.notificationService.showErrorMessage(errorMessage);
                channels_1.channelService.appendLine(errorMessage);
                channels_1.channelService.showChannelOutput();
                return;
            }
        }
        const messages = {
            warningMessageKey: 'conflict_detect_conflicts_during_deploy',
            commandHint: input => {
                return new cli_1.SfdxCommandBuilder()
                    .withArg('force:source:deploy')
                    .withFlag('--manifest', input)
                    .build()
                    .toString();
            }
        };
        const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), new util_1.FilePathGatherer(manifestUri), new ForceSourceDeployManifestExecutor(), new postconditionCheckers_1.ConflictDetectionChecker(messages));
        yield commandlet.run();
    });
}
exports.forceSourceDeployManifest = forceSourceDeployManifest;
//# sourceMappingURL=forceSourceDeployManifest.js.map