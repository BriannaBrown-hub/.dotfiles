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
const util_1 = require("../util");
const util_2 = require("./util");
class ForceApexExecuteExecutor extends util_2.SfdxCommandletExecutor {
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_apex_execute_document_text'))
            .withArg('force:apex:execute')
            .withFlag('--apexcodefile', data.fileName)
            .withLogName('force_apex_execute')
            .build();
    }
}
class CreateApexTempFile {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            if (util_1.hasRootWorkspace()) {
                const fileName = path.join(util_1.getRootWorkspacePath(), '.sfdx', 'tools', 'tempApex.input');
                const editor = yield vscode.window.activeTextEditor;
                if (!editor) {
                    return { type: 'CANCEL' };
                }
                let writeFile;
                const document = editor.document;
                if (editor.selection.isEmpty) {
                    writeFile = yield writeFileAsync(fileName, document.getText());
                }
                else {
                    writeFile = yield writeFileAsync(fileName, document.getText(editor.selection));
                }
                return writeFile
                    ? { type: 'CONTINUE', data: { fileName } }
                    : { type: 'CANCEL' };
            }
            return { type: 'CANCEL' };
        });
    }
}
function writeFileAsync(fileName, inputText) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, inputText, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.writeFileAsync = writeFileAsync;
const workspaceChecker = new util_2.SfdxWorkspaceChecker();
const fileNameGatherer = new CreateApexTempFile();
function forceApexExecute(withSelection) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_2.SfdxCommandlet(workspaceChecker, fileNameGatherer, new ForceApexExecuteExecutor());
        yield commandlet.run();
    });
}
exports.forceApexExecute = forceApexExecute;
//# sourceMappingURL=forceApexExecute.js.map