"use strict";
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
function getRange(lineNumber, columnNumber) {
    const ln = Number(lineNumber);
    const col = Number(columnNumber);
    const pos = new vscode.Position(ln > 0 ? ln - 1 : 0, col > 0 ? col - 1 : 0);
    return new vscode.Range(pos, pos);
}
exports.getRange = getRange;
function handleDiagnosticErrors(errors, workspacePath, sourcePathOrPaths, errorCollection) {
    errorCollection.clear();
    // In the case that we have deployed multiple source paths,
    // the default error path for errors without an associated
    // file path should be the workspace path
    const defaultErrorPath = sourcePathOrPaths.includes(',')
        ? workspacePath
        : sourcePathOrPaths;
    const diagnosticMap = new Map();
    if (errors.hasOwnProperty('result')) {
        errors.result.forEach(error => {
            // source:deploy sometimes returns N/A as filePath
            const fileUri = error.filePath === 'N/A'
                ? defaultErrorPath
                : path.join(workspacePath, error.filePath);
            const range = getRange(error.lineNumber || '1', error.columnNumber || '1');
            const diagnostic = {
                message: error.error,
                severity: vscode.DiagnosticSeverity.Error,
                source: error.type,
                range
            };
            if (!diagnosticMap.has(fileUri)) {
                diagnosticMap.set(fileUri, []);
            }
            diagnosticMap.get(fileUri).push(diagnostic);
        });
        diagnosticMap.forEach((diagMap, file) => {
            const fileUri = vscode.Uri.file(file);
            errorCollection.set(fileUri, diagMap);
        });
    }
    else if (errors.hasOwnProperty('message')) {
        const fileUri = vscode.Uri.file(defaultErrorPath);
        const range = getRange('1', '1');
        const diagnostic = {
            message: errors.message,
            severity: vscode.DiagnosticSeverity.Error,
            source: errors.name,
            range
        };
        errorCollection.set(fileUri, [diagnostic]);
    }
    return errorCollection;
}
exports.handleDiagnosticErrors = handleDiagnosticErrors;
function handleLibraryDiagnostics(deployResult, errorCollection) {
    errorCollection.clear();
    const diagnosticMap = new Map();
    deployResult.DeployDetails.componentFailures.forEach(err => {
        const range = getRange(err.lineNumber ? err.lineNumber.toString() : '1', err.columnNumber ? err.columnNumber.toString() : '1');
        const diagnostic = {
            message: err.problem,
            severity: vscode.DiagnosticSeverity.Error,
            source: err.fileName,
            range
        };
        // NOTE: This is a workaround while we fix DeployResults not providing full
        // path info
        const fileUri = deployResult.metadataFile.replace('-meta.xml', '');
        if (!diagnosticMap.has(fileUri)) {
            diagnosticMap.set(fileUri, []);
        }
        diagnosticMap.get(fileUri).push(diagnostic);
    });
    diagnosticMap.forEach((diagMap, file) => {
        const fileUri = vscode.Uri.file(file);
        errorCollection.set(fileUri, diagMap);
    });
    return errorCollection;
}
exports.handleLibraryDiagnostics = handleLibraryDiagnostics;
//# sourceMappingURL=diagnostics.js.map