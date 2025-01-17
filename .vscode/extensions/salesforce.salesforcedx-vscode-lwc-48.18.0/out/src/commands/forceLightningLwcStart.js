"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
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
const Subject_1 = require("rxjs/Subject");
const vscode = require("vscode");
const messages_1 = require("../messages");
const devServerService_1 = require("../service/devServerService");
const commandConstants_1 = require("./commandConstants");
const commandUtils_1 = require("./commandUtils");
const sfdxCoreExports = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core').exports;
const { channelService, taskViewService, notificationService, SfdxCommandlet, ProgressNotification, EmptyParametersGatherer, SfdxWorkspaceChecker } = sfdxCoreExports;
const SfdxCommandletExecutor = sfdxCoreExports.SfdxCommandletExecutor;
const logName = 'force_lightning_lwc_start';
const commandName = messages_1.nls.localize(`force_lightning_lwc_start_text`);
/**
 * Hints for providing a user-friendly error message / action.
 * Hints come from the stderr output of lwc-dev-server. (We should move this to lwc-dev-server later)
 */
var errorHints;
(function (errorHints) {
    errorHints["SERVER_STARTUP_FALIED"] = "Server start up failed";
    errorHints["ADDRESS_IN_USE"] = "EADDRINUSE";
    errorHints["INACTIVE_SCRATCH_ORG"] = "Error authenticating to your scratch org. Make sure that it is still active";
})(errorHints = exports.errorHints || (exports.errorHints = {}));
class ForceLightningLwcStartExecutor extends SfdxCommandletExecutor {
    constructor(options = { openBrowser: true }) {
        super();
        this.options = options;
    }
    build() {
        return (new cli_1.SfdxCommandBuilder()
            .withDescription(commandName)
            .withArg('force:lightning:lwc:start')
            .withLogName(logName)
            // .withJson()
            .build());
    }
    execute(response) {
        const startTime = process.hrtime();
        const cancellationTokenSource = new vscode.CancellationTokenSource();
        const cancellationToken = cancellationTokenSource.token;
        const executor = new cli_1.CliCommandExecutor(this.build(), {
            cwd: this.executionCwd,
            env: { SFDX_JSON_TO_STDOUT: 'true' }
        });
        const execution = executor.execute(cancellationToken);
        const executionName = execution.command.toString();
        const serverHandler = {
            stop: () => __awaiter(this, void 0, void 0, function* () {
                return execution.killExecution('SIGTERM');
            })
        };
        devServerService_1.DevServerService.instance.registerServerHandler(serverHandler);
        channelService.streamCommandOutput(execution);
        channelService.showChannelOutput();
        let serverStarted = false;
        let printedError = false;
        const progress = new Subject_1.Subject();
        ProgressNotification.show(execution, cancellationTokenSource, vscode.ProgressLocation.Notification, progress.asObservable());
        const task = taskViewService.addCommandExecution(execution, cancellationTokenSource);
        // listen for server startup
        execution.stdoutSubject.subscribe((data) => __awaiter(this, void 0, void 0, function* () {
            if (!serverStarted && data && data.toString().includes('Server up')) {
                serverStarted = true;
                progress.complete();
                taskViewService.removeTask(task);
                notificationService.showSuccessfulExecution(executionName);
                if (this.options.openBrowser) {
                    yield commandUtils_1.openBrowser(this.options.fullUrl || commandConstants_1.DEV_SERVER_BASE_URL);
                }
                this.logMetric(execution.command.logName, startTime);
            }
        }));
        execution.stderrSubject.subscribe((data) => __awaiter(this, void 0, void 0, function* () {
            if (!printedError && data) {
                let errorCode = -1;
                if (data.toString().includes("Server start up failed" /* SERVER_STARTUP_FALIED */)) {
                    errorCode = 1;
                }
                if (data.toString().includes("EADDRINUSE" /* ADDRESS_IN_USE */)) {
                    errorCode = 98;
                }
                if (data.toString().includes("Error authenticating to your scratch org. Make sure that it is still active" /* INACTIVE_SCRATCH_ORG */)) {
                    this.errorHint = "Error authenticating to your scratch org. Make sure that it is still active" /* INACTIVE_SCRATCH_ORG */;
                }
                if (errorCode !== -1) {
                    this.handleErrors(cancellationToken, serverHandler, serverStarted, errorCode);
                    progress.complete();
                    printedError = true;
                }
            }
        }));
        execution.processExitSubject.subscribe((exitCode) => __awaiter(this, void 0, void 0, function* () {
            if (!printedError) {
                this.handleErrors(cancellationToken, serverHandler, serverStarted, exitCode);
                printedError = true;
            }
        }));
        notificationService.reportExecutionError(executionName, execution.processErrorSubject);
        cancellationToken.onCancellationRequested(() => {
            notificationService.showWarningMessage(messages_1.nls.localize('command_canceled', executionName));
            this.showChannelOutput();
        });
    }
    handleErrors(cancellationToken, serverHandler, serverStarted, exitCode) {
        devServerService_1.DevServerService.instance.clearServerHandler(serverHandler);
        if (!serverStarted && !cancellationToken.isCancellationRequested) {
            let message = messages_1.nls.localize('force_lightning_lwc_start_failed');
            if (exitCode === 1 &&
                this.errorHint === "Error authenticating to your scratch org. Make sure that it is still active" /* INACTIVE_SCRATCH_ORG */) {
                message = messages_1.nls.localize('force_lightning_lwc_inactive_scratch_org');
            }
            if (exitCode === 127) {
                message = messages_1.nls.localize('force_lightning_lwc_start_not_found');
            }
            if (exitCode === 98) {
                message = messages_1.nls.localize('force_lightning_lwc_start_addr_in_use');
            }
            commandUtils_1.showError(new Error(message), logName, commandName);
        }
        else if (exitCode !== undefined && exitCode !== null && exitCode > 0) {
            const message = messages_1.nls.localize('force_lightning_lwc_start_exited', exitCode);
            commandUtils_1.showError(new Error(message), logName, commandName);
        }
    }
}
exports.ForceLightningLwcStartExecutor = ForceLightningLwcStartExecutor;
function forceLightningLwcStart() {
    return __awaiter(this, void 0, void 0, function* () {
        if (devServerService_1.DevServerService.instance.isServerHandlerRegistered()) {
            const warningMessage = messages_1.nls.localize('force_lightning_lwc_start_already_running');
            const openBrowserOption = messages_1.nls.localize('prompt_option_open_browser');
            const restartOption = messages_1.nls.localize('prompt_option_restart');
            const response = yield notificationService.showWarningMessage(warningMessage, openBrowserOption, restartOption);
            if (response === openBrowserOption) {
                yield commandUtils_1.openBrowser(commandConstants_1.DEV_SERVER_BASE_URL);
                return;
            }
            else if (response === restartOption) {
                channelService.appendLine(messages_1.nls.localize('force_lightning_lwc_stop_in_progress'));
                yield devServerService_1.DevServerService.instance.stopServer();
            }
            else {
                console.log('local development server already running, no action taken');
                return;
            }
        }
        const preconditionChecker = new SfdxWorkspaceChecker();
        const parameterGatherer = new EmptyParametersGatherer();
        const executor = new ForceLightningLwcStartExecutor();
        const commandlet = new SfdxCommandlet(preconditionChecker, parameterGatherer, executor);
        yield commandlet.run();
    });
}
exports.forceLightningLwcStart = forceLightningLwcStart;
//# sourceMappingURL=forceLightningLwcStart.js.map