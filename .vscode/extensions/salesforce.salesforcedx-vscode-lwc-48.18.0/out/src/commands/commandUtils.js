"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const messages_1 = require("../messages");
const sfdxCoreExports = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core').exports;
const { channelService, notificationService, telemetryService } = sfdxCoreExports;
function showError(e, logName, commandName) {
    telemetryService.sendException(`${logName}_error`, e.message);
    notificationService.showErrorMessage(e.message);
    notificationService.showErrorMessage(messages_1.nls.localize('command_failure', commandName));
    channelService.appendLine(`Error: ${e.message}`);
    channelService.showChannelOutput();
}
exports.showError = showError;
function openBrowser(url) {
    return vscode.env.openExternal(vscode.Uri.parse(url));
}
exports.openBrowser = openBrowser;
//# sourceMappingURL=commandUtils.js.map