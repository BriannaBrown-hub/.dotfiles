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
const vscode = require("vscode");
const messages_1 = require("../messages");
const testRunCache_1 = require("../testRunCache");
const sfdxCoreExports = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core').exports;
const EmptyParametersGatherer = sfdxCoreExports.EmptyParametersGatherer;
const sfdxCoreSettings = sfdxCoreExports.sfdxCoreSettings;
const SfdxCommandlet = sfdxCoreExports.SfdxCommandlet;
const SfdxWorkspaceChecker = sfdxCoreExports.SfdxWorkspaceChecker;
const SfdxCommandletExecutor = sfdxCoreExports.SfdxCommandletExecutor;
const notificationService = sfdxCoreExports.notificationService;
// build force:apex:test:run w/ given test class or test method
class ForceApexTestRunCodeActionExecutor extends SfdxCommandletExecutor {
    constructor(test, shouldGetCodeCoverage, outputToJson) {
        super();
        this.shouldGetCodeCoverage = false;
        this.builder = new cli_1.SfdxCommandBuilder();
        this.test = test || '';
        this.shouldGetCodeCoverage = shouldGetCodeCoverage;
        this.outputToJson = outputToJson;
    }
    build(data) {
        this.builder = this.builder
            .withDescription(messages_1.nls.localize('force_apex_test_run_codeAction_description_text'))
            .withArg('force:apex:test:run')
            .withFlag('--tests', this.test)
            .withFlag('--resultformat', 'human')
            .withFlag('--outputdir', this.outputToJson)
            .withFlag('--loglevel', 'error')
            .withLogName('force_apex_test_run_code_action');
        if (this.shouldGetCodeCoverage) {
            this.builder = this.builder.withArg('--codecoverage');
        }
        return this.builder.build();
    }
}
exports.ForceApexTestRunCodeActionExecutor = ForceApexTestRunCodeActionExecutor;
function forceApexTestRunCodeAction(test) {
    return __awaiter(this, void 0, void 0, function* () {
        const getCodeCoverage = sfdxCoreSettings.getRetrieveTestCodeCoverage();
        const outputToJson = getTempFolder();
        const commandlet = new SfdxCommandlet(new SfdxWorkspaceChecker(), new EmptyParametersGatherer(), new ForceApexTestRunCodeActionExecutor(test, getCodeCoverage, outputToJson));
        yield commandlet.run();
    });
}
function getTempFolder() {
    if (vscode.workspace && vscode.workspace.workspaceFolders) {
        const apexDir = new cli_1.TestRunner().getTempFolder(vscode.workspace.workspaceFolders[0].uri.fsPath, 'apex');
        return apexDir;
    }
    else {
        throw new Error(messages_1.nls.localize('cannot_determine_workspace'));
    }
}
//   T E S T   C L A S S
// redirects to run-all-tests cmd
function forceApexTestClassRunCodeActionDelegate(testClass) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.commands.executeCommand('sfdx.force.apex.test.class.run', testClass);
    });
}
exports.forceApexTestClassRunCodeActionDelegate = forceApexTestClassRunCodeActionDelegate;
// evaluate test class param: if not provided, apply cached value
// exported for testability
function resolveTestClassParam(testClass) {
    return __awaiter(this, void 0, void 0, function* () {
        if (testRunCache_1.isEmpty(testClass)) {
            // value not provided for re-run invocations
            // apply cached value, if available
            if (testRunCache_1.forceApexTestRunCacheService.hasCachedClassTestParam()) {
                testClass = testRunCache_1.forceApexTestRunCacheService.getLastClassTestParam();
            }
        }
        else {
            yield testRunCache_1.forceApexTestRunCacheService.setCachedClassTestParam(testClass);
        }
        return testClass;
    });
}
exports.resolveTestClassParam = resolveTestClassParam;
// invokes apex test run on all tests in a class
function forceApexTestClassRunCodeAction(testClass) {
    return __awaiter(this, void 0, void 0, function* () {
        testClass = yield resolveTestClassParam(testClass);
        if (testRunCache_1.isEmpty(testClass)) {
            // test param not provided: show error and terminate
            notificationService.showErrorMessage(messages_1.nls.localize('force_apex_test_run_codeAction_no_class_test_param_text'));
            return;
        }
        yield forceApexTestRunCodeAction(testClass);
    });
}
exports.forceApexTestClassRunCodeAction = forceApexTestClassRunCodeAction;
//   T E S T   M E T H O D
// redirects to run-test-method cmd
function forceApexTestMethodRunCodeActionDelegate(testMethod) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.commands.executeCommand('sfdx.force.apex.test.method.run', testMethod);
    });
}
exports.forceApexTestMethodRunCodeActionDelegate = forceApexTestMethodRunCodeActionDelegate;
// evaluate test method param: if not provided, apply cached value
// exported for testability
function resolveTestMethodParam(testMethod) {
    return __awaiter(this, void 0, void 0, function* () {
        if (testRunCache_1.isEmpty(testMethod)) {
            // value not provided for re-run invocations
            // apply cached value, if available
            if (testRunCache_1.forceApexTestRunCacheService.hasCachedMethodTestParam()) {
                testMethod = testRunCache_1.forceApexTestRunCacheService.getLastMethodTestParam();
            }
        }
        else {
            yield testRunCache_1.forceApexTestRunCacheService.setCachedMethodTestParam(testMethod);
        }
        return testMethod;
    });
}
exports.resolveTestMethodParam = resolveTestMethodParam;
// invokes apex test run on a test method
function forceApexTestMethodRunCodeAction(testMethod) {
    return __awaiter(this, void 0, void 0, function* () {
        testMethod = yield resolveTestMethodParam(testMethod);
        if (testRunCache_1.isEmpty(testMethod)) {
            // test param not provided: show error and terminate
            notificationService.showErrorMessage(messages_1.nls.localize('force_apex_test_run_codeAction_no_method_test_param_text'));
            return;
        }
        yield forceApexTestRunCodeAction(testMethod);
    });
}
exports.forceApexTestMethodRunCodeAction = forceApexTestMethodRunCodeAction;
//# sourceMappingURL=forceApexTestRunCodeAction.js.map