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
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli/");
const events = require("events");
const vscode = require("vscode");
const languageClientUtils_1 = require("../languageClientUtils");
const messages_1 = require("../messages");
const testRunCache_1 = require("../testRunCache");
const readableApexTestRunExecutor_1 = require("./readableApexTestRunExecutor");
const testOutlineProvider_1 = require("./testOutlineProvider");
const sfdxCoreExports = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core').exports;
const EmptyParametersGatherer = sfdxCoreExports.EmptyParametersGatherer;
const SfdxCommandlet = sfdxCoreExports.SfdxCommandlet;
const SfdxWorkspaceChecker = sfdxCoreExports.SfdxWorkspaceChecker;
const channelService = sfdxCoreExports.channelService;
const sfdxCoreSettings = sfdxCoreExports.sfdxCoreSettings;
var TestRunType;
(function (TestRunType) {
    TestRunType[TestRunType["All"] = 0] = "All";
    TestRunType[TestRunType["Class"] = 1] = "Class";
    TestRunType[TestRunType["Method"] = 2] = "Method";
})(TestRunType = exports.TestRunType || (exports.TestRunType = {}));
class ApexTestRunner {
    constructor(testOutline, eventsEmitter) {
        this.testOutline = testOutline;
        this.eventsEmitter = eventsEmitter || new events.EventEmitter();
        this.eventsEmitter.on('sfdx:update_selection', this.updateSelection);
    }
    showErrorMessage(test) {
        let testNode = test;
        let position = test.location.range;
        if (testNode instanceof testOutlineProvider_1.ApexTestGroupNode) {
            if (test.contextValue === 'apexTestGroup_Fail') {
                const failedTest = test.children.find(testCase => testCase.contextValue === 'apexTest_Fail');
                if (failedTest) {
                    testNode = failedTest;
                }
            }
        }
        if (testNode instanceof testOutlineProvider_1.ApexTestNode) {
            const errorMessage = testNode.errorMessage;
            if (errorMessage && errorMessage !== '') {
                const stackTrace = testNode.stackTrace;
                position =
                    parseInt(stackTrace.substring(stackTrace.indexOf('line') + 4, stackTrace.indexOf(',')), 10) - 1; // Remove one because vscode location is zero based
                channelService.appendLine('-----------------------------------------');
                channelService.appendLine(stackTrace);
                channelService.appendLine(errorMessage);
                channelService.appendLine('-----------------------------------------');
                channelService.showChannelOutput();
            }
        }
        if (testNode.location) {
            vscode.window.showTextDocument(testNode.location.uri).then(() => {
                this.eventsEmitter.emit('sfdx:update_selection', position);
            });
        }
    }
    updateSelection(index) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            if (index instanceof vscode.Range) {
                editor.selection = new vscode.Selection(index.start, index.end);
                editor.revealRange(index); // Show selection
            }
            else {
                const line = editor.document.lineAt(index);
                const startPos = new vscode.Position(line.lineNumber, line.firstNonWhitespaceCharacterIndex);
                editor.selection = new vscode.Selection(startPos, line.range.end);
                editor.revealRange(line.range); // Show selection
            }
        }
    }
    getTempFolder() {
        if (vscode.workspace && vscode.workspace.workspaceFolders) {
            const apexDir = new cli_1.TestRunner().getTempFolder(vscode.workspace.workspaceFolders[0].uri.fsPath, 'apex');
            return apexDir;
        }
        else {
            throw new Error(messages_1.nls.localize('cannot_determine_workspace'));
        }
    }
    runAllApexTests() {
        return __awaiter(this, void 0, void 0, function* () {
            const tests = Array.from(this.testOutline.testStrings.values());
            yield this.runApexTests(tests, TestRunType.All);
        });
    }
    runApexTests(tests, testRunType) {
        return __awaiter(this, void 0, void 0, function* () {
            const languageClientStatus = languageClientUtils_1.languageClientUtils.getStatus();
            if (!languageClientStatus.isReady()) {
                if (languageClientStatus.failedToInitialize()) {
                    vscode.window.showErrorMessage(languageClientStatus.getStatusMessage());
                    return Promise.resolve([]);
                }
            }
            const tmpFolder = this.getTempFolder();
            const getCodeCoverage = sfdxCoreSettings.getRetrieveTestCodeCoverage();
            if (testRunType === TestRunType.Class) {
                yield testRunCache_1.forceApexTestRunCacheService.setCachedClassTestParam(tests[0]);
            }
            else if (testRunType === TestRunType.Method) {
                yield testRunCache_1.forceApexTestRunCacheService.setCachedMethodTestParam(tests[0]);
            }
            const builder = new readableApexTestRunExecutor_1.ReadableApexTestRunExecutor(tests, getCodeCoverage, tmpFolder);
            const commandlet = new SfdxCommandlet(new SfdxWorkspaceChecker(), new EmptyParametersGatherer(), builder);
            yield commandlet.run();
        });
    }
}
exports.ApexTestRunner = ApexTestRunner;
//# sourceMappingURL=testRunner.js.map