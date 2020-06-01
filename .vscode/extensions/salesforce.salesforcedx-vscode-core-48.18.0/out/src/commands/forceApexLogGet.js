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
const date_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/date");
const fs = require("fs");
const path = require("path");
const shelljs_1 = require("shelljs");
const vscode = require("vscode");
const channels_1 = require("../channels");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const statuses_1 = require("../statuses");
const util_1 = require("../util");
const util_2 = require("./util");
class ForceApexLogGetExecutor extends util_2.SfdxCommandletExecutor {
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_apex_log_get_text'))
            .withArg('force:apex:log:get')
            .withFlag('--logid', data.id)
            .withJson()
            .withLogName('force_apex_log_get')
            .build();
    }
    attachExecution(execution, cancellationTokenSource, cancellationToken) {
        channels_1.channelService.streamCommandStartStop(execution);
        notifications_1.notificationService.reportCommandExecutionStatus(execution, cancellationToken);
        notifications_1.ProgressNotification.show(execution, cancellationTokenSource);
        statuses_1.taskViewService.addCommandExecution(execution, cancellationTokenSource);
    }
    execute(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = process.hrtime();
            const cancellationTokenSource = new vscode.CancellationTokenSource();
            const cancellationToken = cancellationTokenSource.token;
            const execution = new cli_1.CliCommandExecutor(this.build(response.data), {
                cwd: util_1.getRootWorkspacePath()
            }).execute(cancellationToken);
            this.attachExecution(execution, cancellationTokenSource, cancellationToken);
            execution.processExitSubject.subscribe(() => {
                this.logMetric(execution.command.logName, startTime);
            });
            const result = yield new cli_1.CommandOutput().getCmdResult(execution);
            const resultJson = JSON.parse(result);
            if (resultJson.status === 0) {
                const logDir = path.join(util_1.getRootWorkspacePath(), '.sfdx', 'tools', 'debug', 'logs');
                if (!fs.existsSync(logDir)) {
                    shelljs_1.mkdir('-p', logDir);
                }
                const localUTCDate = new Date(response.data.startTime);
                const date = date_1.getYYYYMMddHHmmssDateFormat(localUTCDate);
                const logPath = path.join(logDir, `${response.data.id}_${date}.log`);
                fs.writeFileSync(logPath, resultJson.result.log);
                const document = yield vscode.workspace.openTextDocument(logPath);
                vscode.window.showTextDocument(document);
            }
        });
    }
}
exports.ForceApexLogGetExecutor = ForceApexLogGetExecutor;
class LogFileSelector {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const cancellationTokenSource = new vscode.CancellationTokenSource();
            const logInfos = yield ForceApexLogList.getLogs(cancellationTokenSource);
            if (logInfos.length > 0) {
                const logItems = logInfos.map(logInfo => {
                    const icon = '$(file-text) ';
                    const localUTCDate = new Date(logInfo.StartTime);
                    const localDateFormatted = localUTCDate.toLocaleDateString(undefined, date_1.optionYYYYMMddHHmmss);
                    return {
                        id: logInfo.Id,
                        label: icon + logInfo.LogUser.Name + ' - ' + logInfo.Operation,
                        startTime: localDateFormatted,
                        detail: localDateFormatted + ' - ' + logInfo.Status.substr(0, 150),
                        description: `${(logInfo.LogLength / 1024).toFixed(2)} KB`
                    };
                });
                const logItem = yield vscode.window.showQuickPick(logItems, { placeHolder: messages_1.nls.localize('force_apex_log_get_pick_log_text') }, cancellationTokenSource.token);
                if (logItem) {
                    return {
                        type: 'CONTINUE',
                        data: { id: logItem.id, startTime: logItem.startTime }
                    };
                }
            }
            else {
                return {
                    type: 'CANCEL',
                    msg: messages_1.nls.localize('force_apex_log_get_no_logs_text')
                };
            }
            return { type: 'CANCEL' };
        });
    }
}
exports.LogFileSelector = LogFileSelector;
class ForceApexLogList {
    static getLogs(cancellationTokenSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = new cli_1.CliCommandExecutor(new cli_1.SfdxCommandBuilder()
                .withDescription(messages_1.nls.localize('force_apex_log_list_text'))
                .withArg('force:apex:log:list')
                .withJson()
                .withLogName('force_apex_log_list')
                .build(), { cwd: util_1.getRootWorkspacePath() }).execute();
            notifications_1.ProgressNotification.show(execution, cancellationTokenSource);
            statuses_1.taskViewService.addCommandExecution(execution, cancellationTokenSource);
            notifications_1.notificationService.reportExecutionError(execution.command.toString(), execution.processErrorSubject);
            const cmdOutput = new cli_1.CommandOutput();
            const result = yield cmdOutput.getCmdResult(execution);
            try {
                const apexDebugLogObjects = JSON.parse(result)
                    .result;
                apexDebugLogObjects.sort((a, b) => {
                    return (new Date(b.StartTime).valueOf() - new Date(a.StartTime).valueOf());
                });
                return Promise.resolve(apexDebugLogObjects);
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
}
exports.ForceApexLogList = ForceApexLogList;
const workspaceChecker = new util_2.SfdxWorkspaceChecker();
const parameterGatherer = new LogFileSelector();
function forceApexLogGet(explorerDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_2.SfdxCommandlet(workspaceChecker, parameterGatherer, new ForceApexLogGetExecutor());
        yield commandlet.run();
    });
}
exports.forceApexLogGet = forceApexLogGet;
//# sourceMappingURL=forceApexLogGet.js.map