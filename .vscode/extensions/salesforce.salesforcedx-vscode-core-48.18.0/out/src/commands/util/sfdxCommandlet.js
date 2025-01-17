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
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const vscode = require("vscode");
const _1 = require(".");
const channels_1 = require("../../channels");
const notifications_1 = require("../../notifications");
const statuses_1 = require("../../statuses");
const telemetry_1 = require("../../telemetry");
const util_1 = require("../../util");
class SfdxCommandletExecutor {
    constructor() {
        this.showChannelOutput = true;
        this.executionCwd = util_1.getRootWorkspacePath();
    }
    attachExecution(execution, cancellationTokenSource, cancellationToken) {
        channels_1.channelService.streamCommandOutput(execution);
        if (this.showChannelOutput) {
            channels_1.channelService.showChannelOutput();
        }
        notifications_1.notificationService.reportCommandExecutionStatus(execution, cancellationToken);
        notifications_1.ProgressNotification.show(execution, cancellationTokenSource);
        statuses_1.taskViewService.addCommandExecution(execution, cancellationTokenSource);
    }
    logMetric(logName, executionTime, additionalData) {
        telemetry_1.telemetryService.sendCommandEvent(logName, executionTime, additionalData);
    }
    execute(response) {
        const startTime = process.hrtime();
        const cancellationTokenSource = new vscode.CancellationTokenSource();
        const cancellationToken = cancellationTokenSource.token;
        const execution = new cli_1.CliCommandExecutor(this.build(response.data), {
            cwd: this.executionCwd,
            env: { SFDX_JSON_TO_STDOUT: 'true' }
        }).execute(cancellationToken);
        let output = '';
        execution.stdoutSubject.subscribe(realData => {
            output += realData.toString();
        });
        execution.processExitSubject.subscribe(exitCode => {
            const telemetryData = this.getTelemetryData(exitCode === 0, response, output);
            let properties;
            if (telemetryData) {
                properties = telemetryData.properties;
            }
            this.logMetric(execution.command.logName, startTime, properties);
        });
        this.attachExecution(execution, cancellationTokenSource, cancellationToken);
    }
    getTelemetryData(success, response, output) {
        return;
    }
}
exports.SfdxCommandletExecutor = SfdxCommandletExecutor;
class SfdxCommandlet {
    constructor(checker, gatherer, executor, postchecker = new _1.EmptyPostChecker()) {
        this.prechecker = checker;
        this.gatherer = gatherer;
        this.executor = executor;
        this.postchecker = postchecker;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.prechecker.check()) {
                let inputs = yield this.gatherer.gather();
                inputs = yield this.postchecker.check(inputs);
                switch (inputs.type) {
                    case 'CONTINUE':
                        return this.executor.execute(inputs);
                    case 'CANCEL':
                        if (inputs.msg) {
                            notifications_1.notificationService.showErrorMessage(inputs.msg);
                        }
                        return;
                }
            }
        });
    }
}
exports.SfdxCommandlet = SfdxCommandlet;
//# sourceMappingURL=sfdxCommandlet.js.map