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
const lightning_lsp_common_1 = require("@salesforce/lightning-lsp-common");
const fs = require("fs");
const vscode = require("vscode");
const messages_1 = require("../messages");
const devServerService_1 = require("../service/devServerService");
const commandConstants_1 = require("./commandConstants");
const commandUtils_1 = require("./commandUtils");
const forceLightningLwcStart_1 = require("./forceLightningLwcStart");
const sfdxCoreExports = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core').exports;
const { telemetryService, SfdxCommandlet, EmptyParametersGatherer, SfdxWorkspaceChecker } = sfdxCoreExports;
const logName = 'force_lightning_lwc_preview';
const commandName = messages_1.nls.localize('force_lightning_lwc_preview_text');
function forceLightningLwcPreview(sourceUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = process.hrtime();
        if (!sourceUri) {
            const message = messages_1.nls.localize('force_lightning_lwc_preview_file_undefined', sourceUri);
            commandUtils_1.showError(new Error(message), logName, commandName);
            return;
        }
        const resourcePath = sourceUri.fsPath;
        if (!resourcePath) {
            const message = messages_1.nls.localize('force_lightning_lwc_preview_file_undefined', resourcePath);
            commandUtils_1.showError(new Error(message), logName, commandName);
            return;
        }
        if (!fs.existsSync(resourcePath)) {
            const message = messages_1.nls.localize('force_lightning_lwc_preview_file_nonexist', resourcePath);
            commandUtils_1.showError(new Error(message), logName, commandName);
            return;
        }
        const isSFDX = true; // TODO support non SFDX projects
        const isDirectory = fs.lstatSync(resourcePath).isDirectory();
        const componentName = isDirectory
            ? lightning_lsp_common_1.componentUtil.moduleFromDirectory(resourcePath, isSFDX)
            : lightning_lsp_common_1.componentUtil.moduleFromFile(resourcePath, isSFDX);
        if (!componentName) {
            const message = messages_1.nls.localize('force_lightning_lwc_preview_unsupported', resourcePath);
            commandUtils_1.showError(new Error(message), logName, commandName);
            return;
        }
        const fullUrl = `${commandConstants_1.DEV_SERVER_PREVIEW_ROUTE}/${componentName}`;
        if (devServerService_1.DevServerService.instance.isServerHandlerRegistered()) {
            try {
                yield commandUtils_1.openBrowser(fullUrl);
                telemetryService.sendCommandEvent(logName, startTime);
            }
            catch (e) {
                commandUtils_1.showError(e, logName, commandName);
            }
        }
        else {
            console.log(`${logName}: server was not running, starting...`);
            const preconditionChecker = new SfdxWorkspaceChecker();
            const parameterGatherer = new EmptyParametersGatherer();
            const executor = new forceLightningLwcStart_1.ForceLightningLwcStartExecutor({
                openBrowser: true,
                fullUrl
            });
            const commandlet = new SfdxCommandlet(preconditionChecker, parameterGatherer, executor);
            yield commandlet.run();
            telemetryService.sendCommandEvent(logName, startTime);
        }
    });
}
exports.forceLightningLwcPreview = forceLightningLwcPreview;
//# sourceMappingURL=forceLightningLwcPreview.js.map