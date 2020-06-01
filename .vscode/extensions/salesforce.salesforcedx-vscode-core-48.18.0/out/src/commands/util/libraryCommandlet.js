"use strict";
/*
 * Copyright (c) 2020, salesforce.com, inc.
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
const source_deploy_retrieve_1 = require("@salesforce/source-deploy-retrieve");
const vscode_1 = require("vscode");
const channels_1 = require("../../channels");
const diagnostics_1 = require("../../diagnostics/diagnostics");
const messages_1 = require("../../messages");
const notifications_1 = require("../../notifications");
const telemetry_1 = require("../../telemetry");
const util_1 = require("../../util");
const libraryDeployResultParser_1 = require("./libraryDeployResultParser");
const retrieveParser_1 = require("./retrieveParser");
class LibraryCommandletExecutor {
    constructor() {
        this.showChannelOutput = true;
        this.executionName = '';
    }
    execute(response) { }
    build(execName, telemetryLogName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.executionName = execName;
            this.telemetryName = telemetryLogName;
            // initialize connection
            const usernameOrAlias = yield util_1.OrgAuthInfo.getDefaultUsernameOrAlias(true);
            if (!usernameOrAlias) {
                throw new Error(messages_1.nls.localize('error_no_default_username'));
            }
            const conn = yield util_1.OrgAuthInfo.getConnection(usernameOrAlias);
            this.sourceClient = new source_deploy_retrieve_1.SourceClient(conn);
        });
    }
    retrieveWrapper(fn) {
        const commandName = this.executionName;
        return function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                channels_1.channelService.showCommandWithTimestamp(`Starting ${commandName}`);
                const result = yield vscode_1.window.withProgress({
                    title: commandName,
                    location: vscode_1.ProgressLocation.Notification
                }, () => __awaiter(this, void 0, void 0, function* () {
                    // @ts-ignore
                    return (yield fn.call(this, ...args));
                }));
                channels_1.channelService.appendLine(retrieveParser_1.outputRetrieveTable(result));
                channels_1.channelService.showCommandWithTimestamp(`Finished ${commandName}`);
                yield notifications_1.notificationService.showSuccessfulExecution(commandName);
                return result;
            });
        };
    }
    deployWrapper(fn) {
        const commandName = this.executionName;
        return function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                channels_1.channelService.showCommandWithTimestamp(`Starting ${commandName}`);
                const result = yield vscode_1.window.withProgress({
                    title: commandName,
                    location: vscode_1.ProgressLocation.Notification
                }, () => __awaiter(this, void 0, void 0, function* () {
                    // @ts-ignore
                    return (yield fn.call(this, ...args));
                }));
                const parser = new libraryDeployResultParser_1.LibraryDeployResultParser(result);
                const outputResult = yield parser.outputResult();
                channels_1.channelService.appendLine(outputResult);
                channels_1.channelService.showCommandWithTimestamp(`Finished ${commandName}`);
                if (result.State === source_deploy_retrieve_1.DeployStatusEnum.Completed ||
                    result.State === source_deploy_retrieve_1.DeployStatusEnum.Queued) {
                    LibraryCommandletExecutor.errorCollection.clear();
                    yield notifications_1.notificationService.showSuccessfulExecution(commandName);
                }
                else {
                    diagnostics_1.handleLibraryDiagnostics(result, LibraryCommandletExecutor.errorCollection);
                    notifications_1.notificationService.showFailedExecution(commandName);
                }
                return result;
            });
        };
    }
    logMetric() {
        telemetry_1.telemetryService.sendCommandEvent(this.telemetryName, this.startTime);
    }
    setStartTime() {
        this.startTime = process.hrtime();
    }
    getTelemetryData(success, response, output) {
        return;
    }
}
LibraryCommandletExecutor.errorCollection = vscode_1.languages.createDiagnosticCollection('deploy-errors');
exports.LibraryCommandletExecutor = LibraryCommandletExecutor;
//# sourceMappingURL=libraryCommandlet.js.map