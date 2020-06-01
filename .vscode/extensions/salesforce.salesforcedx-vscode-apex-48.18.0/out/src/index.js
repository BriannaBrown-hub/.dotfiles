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
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const codecoverage_1 = require("./codecoverage");
const commands_1 = require("./commands");
const constants_1 = require("./constants");
const languageClientUtils_1 = require("./languageClientUtils");
const languageServer = require("./languageServer");
const messages_1 = require("./messages");
const telemetry_1 = require("./telemetry");
const testOutlineProvider_1 = require("./views/testOutlineProvider");
const testRunner_1 = require("./views/testRunner");
const sfdxCoreExports = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core').exports;
const coreTelemetryService = sfdxCoreExports.telemetryService;
let languageClient;
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const extensionHRStart = process.hrtime();
        const testOutlineProvider = new testOutlineProvider_1.ApexTestOutlineProvider(null);
        if (vscode.workspace && vscode.workspace.workspaceFolders) {
            const apexDirPath = new cli_1.TestRunner().getTempFolder(vscode.workspace.workspaceFolders[0].uri.fsPath, 'apex');
            const testResultOutput = path.join(apexDirPath, '*.json');
            const testResultFileWatcher = vscode.workspace.createFileSystemWatcher(testResultOutput);
            testResultFileWatcher.onDidCreate(uri => testOutlineProvider.onResultFileCreate(apexDirPath, uri.fsPath));
            context.subscriptions.push(testResultFileWatcher);
        }
        else {
            throw new Error(messages_1.nls.localize('cannot_determine_workspace'));
        }
        // Telemetry
        telemetry_1.telemetryService.initializeService(coreTelemetryService.getReporter(), coreTelemetryService.isTelemetryEnabled());
        // Initialize Apex language server
        try {
            const langClientHRStart = process.hrtime();
            languageClient = yield languageServer.createLanguageServer(context);
            languageClientUtils_1.languageClientUtils.setClientInstance(languageClient);
            const handle = languageClient.start();
            languageClientUtils_1.languageClientUtils.setStatus(languageClientUtils_1.ClientStatus.Indexing, '');
            context.subscriptions.push(handle);
            languageClient
                .onReady()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                if (languageClient) {
                    languageClient.onNotification('indexer/done', () => __awaiter(this, void 0, void 0, function* () {
                        // Refresh SObject definitions if there aren't any faux classes
                        const sobjectRefreshStartup = vscode.workspace
                            .getConfiguration(constants_1.SFDX_APEX_CONFIGURATION_NAME)
                            .get(constants_1.ENABLE_SOBJECT_REFRESH_ON_STARTUP, false);
                        if (sobjectRefreshStartup) {
                            commands_1.initSObjectDefinitions(vscode.workspace.workspaceFolders[0].uri.fsPath).catch(e => telemetry_1.telemetryService.sendErrorEvent({
                                message: e.message,
                                stack: e.stack
                            }));
                        }
                        yield testOutlineProvider.refresh();
                    }));
                }
                // TODO: This currently keeps existing behavior in which we set the language
                // server to ready before it finishes indexing. We'll evaluate this in the future.
                languageClientUtils_1.languageClientUtils.setStatus(languageClientUtils_1.ClientStatus.Ready, '');
                telemetry_1.telemetryService.sendApexLSPActivationEvent(langClientHRStart);
            }))
                .catch(err => {
                // Handled by clients
                telemetry_1.telemetryService.sendApexLSPError(err);
                languageClientUtils_1.languageClientUtils.setStatus(languageClientUtils_1.ClientStatus.Error, messages_1.nls.localize('apex_language_server_failed_activate'));
            });
        }
        catch (e) {
            console.error('Apex language server failed to initialize');
            languageClientUtils_1.languageClientUtils.setStatus(languageClientUtils_1.ClientStatus.Error, e);
        }
        // Javadoc support
        languageClientUtils_1.enableJavaDocSymbols();
        // Commands
        const commands = registerCommands(context);
        context.subscriptions.push(commands);
        context.subscriptions.push(yield registerTestView(testOutlineProvider));
        const exportedApi = {
            getLineBreakpointInfo: languageClientUtils_1.getLineBreakpointInfo,
            getExceptionBreakpointInfo: languageClientUtils_1.getExceptionBreakpointInfo,
            getApexTests: languageClientUtils_1.getApexTests,
            languageClientUtils: languageClientUtils_1.languageClientUtils
        };
        telemetry_1.telemetryService.sendExtensionActivationEvent(extensionHRStart);
        return exportedApi;
    });
}
exports.activate = activate;
function registerCommands(extensionContext) {
    // Colorize code coverage
    const statusBarToggle = new codecoverage_1.StatusBarToggle();
    const colorizer = new codecoverage_1.CodeCoverage(statusBarToggle);
    const forceApexToggleColorizerCmd = vscode.commands.registerCommand('sfdx.force.apex.toggle.colorizer', () => colorizer.toggleCoverage());
    // Customer-facing commands
    const forceApexTestClassRunDelegateCmd = vscode.commands.registerCommand('sfdx.force.apex.test.class.run.delegate', commands_1.forceApexTestClassRunCodeActionDelegate);
    const forceApexTestLastClassRunCmd = vscode.commands.registerCommand('sfdx.force.apex.test.last.class.run', commands_1.forceApexTestClassRunCodeAction);
    const forceApexTestClassRunCmd = vscode.commands.registerCommand('sfdx.force.apex.test.class.run', commands_1.forceApexTestClassRunCodeAction);
    const forceApexTestMethodRunDelegateCmd = vscode.commands.registerCommand('sfdx.force.apex.test.method.run.delegate', commands_1.forceApexTestMethodRunCodeActionDelegate);
    const forceApexTestLastMethodRunCmd = vscode.commands.registerCommand('sfdx.force.apex.test.last.method.run', commands_1.forceApexTestMethodRunCodeAction);
    const forceApexTestMethodRunCmd = vscode.commands.registerCommand('sfdx.force.apex.test.method.run', commands_1.forceApexTestMethodRunCodeAction);
    const forceGenerateFauxClassesCmd = vscode.commands.registerCommand('sfdx.force.internal.refreshsobjects', commands_1.forceGenerateFauxClassesCreate);
    return vscode.Disposable.from(forceApexToggleColorizerCmd, forceApexTestLastClassRunCmd, forceApexTestClassRunCmd, forceApexTestClassRunDelegateCmd, forceApexTestLastMethodRunCmd, forceApexTestMethodRunCmd, forceApexTestMethodRunDelegateCmd, forceGenerateFauxClassesCmd);
}
function registerTestView(testOutlineProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create TestRunner
        const testRunner = new testRunner_1.ApexTestRunner(testOutlineProvider);
        // Test View
        const testViewItems = new Array();
        const testProvider = vscode.window.registerTreeDataProvider('sfdx.force.test.view', testOutlineProvider);
        testViewItems.push(testProvider);
        // Run Test Button on Test View command
        testViewItems.push(vscode.commands.registerCommand('sfdx.force.test.view.run', () => testRunner.runAllApexTests()));
        // Show Error Message command
        testViewItems.push(vscode.commands.registerCommand('sfdx.force.test.view.showError', test => testRunner.showErrorMessage(test)));
        // Show Definition command
        testViewItems.push(vscode.commands.registerCommand('sfdx.force.test.view.goToDefinition', test => testRunner.showErrorMessage(test)));
        // Run Class Tests command
        testViewItems.push(vscode.commands.registerCommand('sfdx.force.test.view.runClassTests', test => testRunner.runApexTests([test.name], testRunner_1.TestRunType.Class)));
        // Run Single Test command
        testViewItems.push(vscode.commands.registerCommand('sfdx.force.test.view.runSingleTest', test => testRunner.runApexTests([test.name], testRunner_1.TestRunType.Method)));
        // Refresh Test View command
        testViewItems.push(vscode.commands.registerCommand('sfdx.force.test.view.refresh', () => {
            if (languageClientUtils_1.languageClientUtils.getStatus().isReady()) {
                return testOutlineProvider.refresh();
            }
        }));
        return vscode.Disposable.from(...testViewItems);
    });
}
function getApexClassFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonProject = (yield vscode.workspace.findFiles('**/sfdx-project.json'))[0];
        const innerText = fs.readFileSync(jsonProject.path);
        const jsonObject = JSON.parse(innerText.toString());
        const packageDirectories = jsonObject.packageDirectories || jsonObject.PackageDirectories;
        const allClasses = new Array();
        for (const packageDirectory of packageDirectories) {
            const pattern = path.join(packageDirectory.path, '**/*.cls');
            const apexClassFiles = yield vscode.workspace.findFiles(pattern);
            allClasses.push(...apexClassFiles);
        }
        return allClasses;
    });
}
exports.getApexClassFiles = getApexClassFiles;
// tslint:disable-next-line:no-empty
function deactivate() {
    telemetry_1.telemetryService.sendExtensionDeactivationEvent();
}
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map