"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
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
const src_1 = require("@salesforce/salesforcedx-sobjects-faux-generator/out/src");
const describe_1 = require("@salesforce/salesforcedx-sobjects-faux-generator/out/src/describe");
const generator_1 = require("@salesforce/salesforcedx-sobjects-faux-generator/out/src/generator");
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const messages_1 = require("../messages");
const telemetry_1 = require("../telemetry");
const sfdxCoreExports = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core').exports;
const { channelService, getDefaultUsernameOrAlias, notificationService, ProgressNotification, SfdxCommandlet, SfdxWorkspaceChecker, taskViewService } = sfdxCoreExports;
const SfdxCommandletExecutor = sfdxCoreExports.SfdxCommandletExecutor;
class SObjectRefreshGatherer {
    constructor(source) {
        this.source = source;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            let category = describe_1.SObjectCategory.ALL;
            if (!this.source || this.source === generator_1.SObjectRefreshSource.Manual) {
                const options = [
                    messages_1.nls.localize('sobject_refresh_all'),
                    messages_1.nls.localize('sobject_refresh_custom'),
                    messages_1.nls.localize('sobject_refresh_standard')
                ];
                const choice = yield vscode.window.showQuickPick(options);
                switch (choice) {
                    case options[0]:
                        category = describe_1.SObjectCategory.ALL;
                        break;
                    case options[1]:
                        category = describe_1.SObjectCategory.CUSTOM;
                        break;
                    case options[2]:
                        category = describe_1.SObjectCategory.STANDARD;
                        break;
                    default:
                        return { type: 'CANCEL' };
                }
            }
            return {
                type: 'CONTINUE',
                data: {
                    category,
                    source: this.source || generator_1.SObjectRefreshSource.Manual
                }
            };
        });
    }
}
exports.SObjectRefreshGatherer = SObjectRefreshGatherer;
class ForceGenerateFauxClassesExecutor extends SfdxCommandletExecutor {
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_sobjects_refresh'))
            .withArg('sobject definitions refresh')
            .withLogName('force_generate_faux_classes_create')
            .build();
    }
    execute(response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ForceGenerateFauxClassesExecutor.isActive) {
                vscode.window.showErrorMessage(messages_1.nls.localize('force_sobjects_no_refresh_if_already_active_error_text'));
                return;
            }
            const startTime = process.hrtime();
            ForceGenerateFauxClassesExecutor.isActive = true;
            const cancellationTokenSource = new vscode.CancellationTokenSource();
            const cancellationToken = cancellationTokenSource.token;
            const execution = new cli_1.LocalCommandExecution(this.build(response.data));
            channelService.streamCommandOutput(execution);
            if (this.showChannelOutput) {
                channelService.showChannelOutput();
            }
            notificationService.reportCommandExecutionStatus(execution, cancellationToken);
            let progressLocation = vscode.ProgressLocation.Notification;
            if (response.data.source !== generator_1.SObjectRefreshSource.Manual) {
                progressLocation = vscode.ProgressLocation.Window;
            }
            ProgressNotification.show(execution, cancellationTokenSource, progressLocation);
            taskViewService.addCommandExecution(execution, cancellationTokenSource);
            const gen = new generator_1.FauxClassGenerator(execution.cmdEmitter, cancellationToken);
            const commandName = execution.command.logName;
            try {
                const result = yield gen.generate(vscode.workspace.workspaceFolders[0].uri.fsPath, response.data.category, response.data.source);
                console.log('Generate success ' + result.data);
                this.logMetric(commandName, startTime, result.data);
            }
            catch (result) {
                console.log('Generate error ' + result.error);
                const commandData = {
                    commandName,
                    executionTime: telemetry_1.telemetryService.getEndHRTime(startTime)
                };
                telemetry_1.telemetryService.sendErrorEvent(result.error, Object.assign(result.data, commandData));
            }
            ForceGenerateFauxClassesExecutor.isActive = false;
            return;
        });
    }
}
ForceGenerateFauxClassesExecutor.isActive = false;
exports.ForceGenerateFauxClassesExecutor = ForceGenerateFauxClassesExecutor;
const workspaceChecker = new SfdxWorkspaceChecker();
function forceGenerateFauxClassesCreate(source) {
    return __awaiter(this, void 0, void 0, function* () {
        const parameterGatherer = new SObjectRefreshGatherer(source);
        const commandlet = new SfdxCommandlet(workspaceChecker, parameterGatherer, new ForceGenerateFauxClassesExecutor());
        yield commandlet.run();
    });
}
exports.forceGenerateFauxClassesCreate = forceGenerateFauxClassesCreate;
function initSObjectDefinitions(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const hasDefaultUsernameSet = (yield getDefaultUsernameOrAlias()) !== undefined;
        if (projectPath && hasDefaultUsernameSet) {
            const sobjectFolder = path.join(projectPath, src_1.SFDX_DIR, src_1.TOOLS_DIR, src_1.SOBJECTS_DIR);
            if (!fs.existsSync(sobjectFolder)) {
                forceGenerateFauxClassesCreate(generator_1.SObjectRefreshSource.Startup).catch(e => {
                    throw e;
                });
            }
        }
    });
}
exports.initSObjectDefinitions = initSObjectDefinitions;
//# sourceMappingURL=forceGenerateFauxClasses.js.map