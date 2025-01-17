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
const path = require("path");
const vscode = require("vscode");
const messages_1 = require("../messages");
const conflictDetectionService_1 = require("./conflictDetectionService");
const conflictView_1 = require("./conflictView");
var conflictDetectionService_2 = require("./conflictDetectionService");
exports.ConflictDetector = conflictDetectionService_2.ConflictDetector;
var directoryDiffer_1 = require("./directoryDiffer");
exports.CommonDirDirectoryDiffer = directoryDiffer_1.CommonDirDirectoryDiffer;
exports.conflictView = conflictView_1.ConflictView.getInstance();
exports.conflictDetector = conflictDetectionService_1.ConflictDetector.getInstance();
function setupConflictView(extensionContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = exports.conflictView;
        yield view.init(extensionContext);
    });
}
exports.setupConflictView = setupConflictView;
function registerConflictView() {
    const viewItems = [];
    viewItems.push(vscode.commands.registerCommand('sfdx.force.conflict.diff', entry => conflictDiff(entry)));
    viewItems.push(vscode.commands.registerCommand('sfdx.force.conflict.open', entry => openResource(entry)));
    return vscode.Disposable.from(...viewItems);
}
exports.registerConflictView = registerConflictView;
function conflictDiff(file) {
    const local = vscode.Uri.file(path.join(file.localPath, file.relPath));
    const remote = vscode.Uri.file(path.join(file.remotePath, file.relPath));
    const title = messages_1.nls.localize('conflict_detect_diff_title', file.remoteLabel, file.fileName, file.fileName);
    vscode.commands.executeCommand('vscode.diff', remote, local, title);
}
function openResource(node) {
    const file = node.conflict;
    if (file) {
        const local = vscode.Uri.file(path.join(file.localPath, file.relPath));
        vscode.window.showTextDocument(local).then(() => { });
    }
}
//# sourceMappingURL=index.js.map