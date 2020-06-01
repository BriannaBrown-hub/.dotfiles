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
const path = require("path");
const vscode = require("vscode");
const fs = require("fs");
const constants_1 = require("../constants");
const languageClientUtils_1 = require("../languageClientUtils");
const messages_1 = require("../messages");
// Message
const LOADING_MESSAGE = messages_1.nls.localize('force_test_view_loading_message');
const NO_TESTS_MESSAGE = messages_1.nls.localize('force_test_view_no_tests_message');
const NO_TESTS_DESCRIPTION = messages_1.nls.localize('force_test_view_no_tests_description');
class ApexTestOutlineProvider {
    constructor(apexTestInfo) {
        this.onDidChangeTestData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.onDidChangeTestData.event;
        this.apexTestMap = new Map();
        this.testStrings = new Set();
        this.rootNode = null;
        this.apexTestInfo = apexTestInfo;
        this.getAllApexTests();
    }
    getHead() {
        if (this.rootNode === null) {
            return this.getAllApexTests();
        }
        else {
            return this.rootNode;
        }
    }
    getChildren(element) {
        if (element) {
            return element.children;
        }
        else {
            if (this.rootNode && this.rootNode.children.length > 0) {
                return this.rootNode.children;
            }
            else {
                let message = NO_TESTS_MESSAGE;
                let description = NO_TESTS_DESCRIPTION;
                const languageClientStatus = languageClientUtils_1.languageClientUtils.getStatus();
                if (!languageClientStatus.isReady()) {
                    if (languageClientStatus.failedToInitialize()) {
                        vscode.window.showInformationMessage(languageClientStatus.getStatusMessage());
                        return new Array();
                    }
                    message = LOADING_MESSAGE;
                    description = '';
                }
                const emptyArray = new Array();
                const testToDisplay = new ApexTestNode(message, null);
                testToDisplay.description = description;
                emptyArray.push(testToDisplay);
                return emptyArray;
            }
        }
    }
    getTreeItem(element) {
        if (element) {
            return element;
        }
        else {
            this.getAllApexTests();
            let message = NO_TESTS_MESSAGE;
            let description = NO_TESTS_DESCRIPTION;
            if (!languageClientUtils_1.languageClientUtils.getStatus().isReady()) {
                message = LOADING_MESSAGE;
                description = '';
            }
            if (!(this.rootNode && this.rootNode.children.length > 0)) {
                this.rootNode = new ApexTestNode(message, null);
                const testToDisplay = new ApexTestNode(message, null);
                testToDisplay.description = description;
                this.rootNode.children.push(testToDisplay);
            }
            return this.rootNode;
        }
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rootNode = null; // Reset tests
            this.apexTestMap.clear();
            this.testStrings.clear();
            this.apexTestInfo = null;
            if (languageClientUtils_1.languageClientUtils.getStatus().isReady()) {
                this.apexTestInfo = yield languageClientUtils_1.getApexTests();
            }
            this.getAllApexTests();
            this.onDidChangeTestData.fire();
        });
    }
    onResultFileCreate(apexTestPath, testResultFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const testRunIdFile = path.join(apexTestPath, 'test-run-id.txt');
            const testRunId = fs.readFileSync(testRunIdFile);
            const testResultFilePath = path.join(apexTestPath, 'test-result-' + testRunId + '.json');
            if (testResultFile === testResultFilePath) {
                yield this.refresh();
                this.readJSONFile(testResultFile);
            }
        });
    }
    getAllApexTests() {
        if (this.rootNode == null) {
            // Starting Out
            this.rootNode = new ApexTestGroupNode('ApexTests', null);
        }
        this.rootNode.children = new Array();
        if (this.apexTestInfo) {
            this.apexTestInfo.forEach(test => {
                let apexGroup = this.apexTestMap.get(test.definingType);
                if (!apexGroup) {
                    const groupLocation = new vscode.Location(test.location.uri, constants_1.APEX_GROUP_RANGE);
                    apexGroup = new ApexTestGroupNode(test.definingType, groupLocation);
                    this.apexTestMap.set(test.definingType, apexGroup);
                }
                const apexTest = new ApexTestNode(test.methodName, test.location);
                apexTest.name = apexGroup.label + '.' + apexTest.label;
                this.apexTestMap.set(apexTest.name, apexTest);
                apexGroup.children.push(apexTest);
                if (this.rootNode &&
                    !(this.rootNode.children.indexOf(apexGroup) >= 0)) {
                    this.rootNode.children.push(apexGroup);
                }
                this.testStrings.add(apexGroup.name);
            });
            // Sorting independently so we don't loose the order of the test methods per test class.
            this.rootNode.children.sort((a, b) => a.name.localeCompare(b.name));
        }
        return this.rootNode;
    }
    readJSONFile(testResultFilePath) {
        const jsonSummary = this.getJSONFileOutput(testResultFilePath);
        this.updateTestsFromJSON(jsonSummary);
        this.onDidChangeTestData.fire();
    }
    getJSONFileOutput(testResultFileName) {
        const testResultOutput = fs.readFileSync(testResultFileName, 'utf8');
        const jsonSummary = JSON.parse(testResultOutput);
        return jsonSummary;
    }
    generateFullName(namespace, initialName) {
        return namespace ? `${namespace}.${initialName}` : initialName;
    }
    updateTestsFromJSON(jsonSummary) {
        const groups = new Set();
        for (const testResult of jsonSummary.tests) {
            const apexGroupName = this.generateFullName(testResult.ApexClass.NamespacePrefix, testResult.FullName.split('.')[0]);
            const apexGroup = this.apexTestMap.get(apexGroupName);
            // Check if new group, if so, set to pass
            if (apexGroup) {
                groups.add(apexGroup);
            }
            const testFullName = this.generateFullName(testResult.ApexClass.NamespacePrefix, testResult.FullName);
            const apexTest = this.apexTestMap.get(testFullName);
            if (apexTest) {
                apexTest.outcome = testResult.Outcome;
                apexTest.updateOutcome();
                if (testResult.Outcome === 'Fail') {
                    apexTest.errorMessage = testResult.Message;
                    apexTest.stackTrace = testResult.StackTrace;
                    apexTest.description =
                        apexTest.stackTrace + '\n' + apexTest.errorMessage;
                }
            }
        }
        groups.forEach(group => {
            group.updatePassFailLabel();
        });
    }
}
exports.ApexTestOutlineProvider = ApexTestOutlineProvider;
class TestNode extends vscode.TreeItem {
    constructor(label, collapsibleState, location) {
        super(label, collapsibleState);
        this.children = new Array();
        this.iconPath = {
            light: constants_1.LIGHT_BLUE_BUTTON,
            dark: constants_1.DARK_BLUE_BUTTON
        };
        this.location = location;
        this.description = label;
        this.name = label;
        this.command = {
            command: 'sfdx.force.test.view.showError',
            title: messages_1.nls.localize('force_test_view_show_error_title'),
            arguments: [this]
        };
    }
    get tooltip() {
        return this.description;
    }
    updateOutcome(outcome) {
        if (outcome === 'Pass') {
            // Passed Test
            this.iconPath = {
                light: constants_1.LIGHT_GREEN_BUTTON,
                dark: constants_1.DARK_GREEN_BUTTON
            };
        }
        else if (outcome === 'Fail') {
            // Failed test
            this.iconPath = {
                light: constants_1.LIGHT_RED_BUTTON,
                dark: constants_1.DARK_RED_BUTTON
            };
        }
        else if (outcome === 'Skip') {
            // Skipped test
            this.iconPath = {
                light: constants_1.LIGHT_ORANGE_BUTTON,
                dark: constants_1.DARK_ORANGE_BUTTON
            };
        }
        const nodeType = this.contextValue.split('_')[0];
        this.contextValue = `${nodeType}_${outcome}`;
    }
}
exports.TestNode = TestNode;
class ApexTestGroupNode extends TestNode {
    constructor(label, location) {
        super(label, vscode.TreeItemCollapsibleState.Expanded, location);
        this.passing = 0;
        this.failing = 0;
        this.skipping = 0;
        this.contextValue = 'apexTestGroup';
    }
    updatePassFailLabel() {
        this.passing = 0;
        this.failing = 0;
        this.skipping = 0;
        this.children.forEach(child => {
            if (child.outcome === 'Pass') {
                this.passing++;
            }
            else if (child.outcome === 'Fail') {
                this.failing++;
            }
            else if (child.outcome === 'Skip') {
                this.skipping++;
            }
        });
        if (this.passing + this.failing + this.skipping === this.children.length) {
            if (this.failing !== 0) {
                this.updateOutcome('Fail');
            }
            else {
                this.updateOutcome('Pass');
            }
        }
    }
    updateOutcome(outcome) {
        super.updateOutcome(outcome);
        if (outcome === 'Pass') {
            this.children.forEach(child => {
                // Update all the children as well
                child.updateOutcome(outcome);
            });
        }
    }
}
exports.ApexTestGroupNode = ApexTestGroupNode;
class ApexTestNode extends TestNode {
    constructor(label, location) {
        super(label, vscode.TreeItemCollapsibleState.None, location);
        this.errorMessage = '';
        this.stackTrace = '';
        this.outcome = 'Not Run';
        this.contextValue = 'apexTest';
    }
    updateOutcome() {
        super.updateOutcome(this.outcome);
        if (this.outcome === 'Pass') {
            this.errorMessage = '';
        }
    }
}
exports.ApexTestNode = ApexTestNode;
//# sourceMappingURL=testOutlineProvider.js.map