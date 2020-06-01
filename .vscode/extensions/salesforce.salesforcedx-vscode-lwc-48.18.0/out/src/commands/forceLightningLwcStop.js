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
const vscode = require("vscode");
const messages_1 = require("../messages");
const devServerService_1 = require("../service/devServerService");
const commandUtils_1 = require("./commandUtils");
const sfdxCoreExports = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core').exports;
const { channelService, notificationService, telemetryService } = sfdxCoreExports;
const logName = 'force_lightning_lwc_stop';
const commandName = messages_1.nls.localize('force_lightning_lwc_stop_text');
function forceLightningLwcStop() {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = process.hrtime();
        try {
            if (devServerService_1.DevServerService.instance.isServerHandlerRegistered()) {
                channelService.appendLine(messages_1.nls.localize('force_lightning_lwc_stop_in_progress'));
                yield devServerService_1.DevServerService.instance.stopServer();
                notificationService.showSuccessfulExecution(messages_1.nls.localize('force_lightning_lwc_stop_text'));
                telemetryService.sendCommandEvent(logName, startTime);
            }
            else {
                notificationService.showWarningMessage(messages_1.nls.localize('force_lightning_lwc_stop_not_running'));
            }
        }
        catch (e) {
            commandUtils_1.showError(e, logName, commandName);
        }
    });
}
exports.forceLightningLwcStop = forceLightningLwcStop;
//# sourceMappingURL=forceLightningLwcStop.js.map