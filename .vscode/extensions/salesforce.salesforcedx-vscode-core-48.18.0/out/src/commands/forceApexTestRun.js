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
const messages_1 = require("../messages");
const settings_1 = require("../settings");
const util_1 = require("../util");
const util_2 = require("./util");
var TestType;
(function (TestType) {
    TestType[TestType["All"] = 0] = "All";
    TestType[TestType["Suite"] = 1] = "Suite";
    TestType[TestType["Class"] = 2] = "Class";
})(TestType = exports.TestType || (exports.TestType = {}));
class TestsSelector {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const testSuites = yield vscode.workspace.findFiles('**/*.testSuite-meta.xml');
            const fileItems = testSuites.map(testSuite => {
                return {
                    label: path
                        .basename(testSuite.toString())
                        .replace('.testSuite-meta.xml', ''),
                    description: testSuite.fsPath,
                    type: TestType.Suite
                };
            });
            const apexClasses = yield vscode.workspace.findFiles('**/*.cls');
            apexClasses.forEach(apexClass => {
                const fileContent = fs.readFileSync(apexClass.fsPath).toString();
                if (fileContent && fileContent.toLowerCase().includes('@istest')) {
                    fileItems.push({
                        label: path.basename(apexClass.toString()).replace('.cls', ''),
                        description: apexClass.fsPath,
                        type: TestType.Class
                    });
                }
            });
            fileItems.push({
                label: messages_1.nls.localize('force_apex_test_run_all_test_label'),
                description: messages_1.nls.localize('force_apex_test_run_all_tests_description_text'),
                type: TestType.All
            });
            const selection = (yield vscode.window.showQuickPick(fileItems));
            return selection
                ? { type: 'CONTINUE', data: selection }
                : { type: 'CANCEL' };
        });
    }
}
exports.TestsSelector = TestsSelector;
class ForceApexTestRunCommandFactory {
    constructor(data, getCodeCoverage, outputToJson) {
        this.builder = new cli_1.SfdxCommandBuilder();
        this.data = data;
        this.getCodeCoverage = getCodeCoverage;
        this.outputToJson = outputToJson;
    }
    constructExecutorCommand() {
        this.builder = this.builder
            .withDescription(messages_1.nls.localize('force_apex_test_run_text'))
            .withArg('force:apex:test:run')
            .withLogName('force_apex_test_run');
        switch (this.data.type) {
            case TestType.Suite:
                this.builder = this.builder.withFlag('--suitenames', `${this.data.label}`);
                break;
            case TestType.Class:
                this.builder = this.builder.withFlag('--classnames', `${this.data.label}`);
                break;
            default:
                break;
        }
        if (this.getCodeCoverage) {
            this.builder = this.builder.withArg('--codecoverage');
        }
        this.builder = this.builder
            .withFlag('--resultformat', 'human')
            .withFlag('--outputdir', this.outputToJson)
            .withFlag('--loglevel', 'error');
        this.testRunExecutorCommand = this.builder.build();
        return this.testRunExecutorCommand;
    }
}
exports.ForceApexTestRunCommandFactory = ForceApexTestRunCommandFactory;
function getTempFolder() {
    if (util_1.hasRootWorkspace()) {
        const apexDir = new cli_1.TestRunner().getTempFolder(util_1.getRootWorkspacePath(), 'apex');
        return apexDir;
    }
    else {
        throw new Error(messages_1.nls.localize('cannot_determine_workspace'));
    }
}
class ForceApexTestRunExecutor extends util_2.SfdxCommandletExecutor {
    build(data) {
        const getCodeCoverage = settings_1.sfdxCoreSettings.getRetrieveTestCodeCoverage();
        const outputToJson = getTempFolder();
        const factory = new ForceApexTestRunCommandFactory(data, getCodeCoverage, outputToJson);
        return factory.constructExecutorCommand();
    }
}
exports.ForceApexTestRunExecutor = ForceApexTestRunExecutor;
const workspaceChecker = new util_2.SfdxWorkspaceChecker();
const parameterGatherer = new TestsSelector();
function forceApexTestRun() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_2.SfdxCommandlet(workspaceChecker, parameterGatherer, new ForceApexTestRunExecutor());
        yield commandlet.run();
    });
}
exports.forceApexTestRun = forceApexTestRun;
//# sourceMappingURL=forceApexTestRun.js.map