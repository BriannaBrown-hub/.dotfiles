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
const path = require("path");
const vscode = require("vscode");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const commands_1 = require("./commands");
const constants_1 = require("./constants");
const devServerService_1 = require("./service/devServerService");
const telemetry_1 = require("./telemetry");
const testSupport_1 = require("./testSupport");
// See https://github.com/Microsoft/vscode-languageserver-node/issues/105
function code2ProtocolConverter(value) {
    if (/^win32/.test(process.platform)) {
        // The *first* : is also being encoded which is not the standard for URI on Windows
        // Here we transform it back to the standard way
        return value.toString().replace('%3A', ':');
    }
    else {
        return value.toString();
    }
}
exports.code2ProtocolConverter = code2ProtocolConverter;
function protocol2CodeConverter(value) {
    return vscode_1.Uri.parse(value);
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const extensionHRStart = process.hrtime();
        console.log('Activation Mode: ' + getActivationMode());
        // Run our auto detection routine before we activate
        // If activationMode is off, don't startup no matter what
        if (getActivationMode() === 'off') {
            console.log('LWC Language Server activationMode set to off, exiting...');
            return;
        }
        // if we have no workspace folders, exit
        if (!vscode_1.workspace.workspaceFolders) {
            console.log('No workspace, exiting extension');
            return;
        }
        // Pass the workspace folder URIs to the language server
        const workspaceUris = [];
        vscode_1.workspace.workspaceFolders.forEach(folder => {
            workspaceUris.push(folder.uri.fsPath);
        });
        // If activationMode is autodetect or always, check workspaceType before startup
        const workspaceType = lightning_lsp_common_1.shared.detectWorkspaceType(workspaceUris);
        // Check if we have a valid project structure
        if (getActivationMode() === 'autodetect' && !lightning_lsp_common_1.shared.isLWC(workspaceType)) {
            // If activationMode === autodetect and we don't have a valid workspace type, exit
            console.log('LWC LSP - autodetect did not find a valid project structure, exiting....');
            console.log('WorkspaceType detected: ' + workspaceType);
            return;
        }
        // If activationMode === always, ignore workspace type and continue activating
        // register commands
        const ourCommands = registerCommands(context);
        context.subscriptions.push(ourCommands);
        // If we get here, we either passed autodetect validation or activationMode == always
        console.log('Lightning Web Components Extension Activated');
        console.log('WorkspaceType detected: ' + workspaceType);
        // Start the LWC Language Server
        startLWCLanguageServer(context);
        if (workspaceType === lightning_lsp_common_1.shared.WorkspaceType.SFDX) {
            // We no longer want to manage the eslint.nodePath. Remove any previous configuration of the nodepath
            // which points at our LWC extension node_modules path
            const config = vscode_1.workspace.getConfiguration('');
            const currentNodePath = config.get(constants_1.ESLINT_NODEPATH_CONFIG);
            if (currentNodePath && currentNodePath.includes(constants_1.LWC_EXTENSION_NAME)) {
                try {
                    console.log('Removing eslint.nodePath setting as the LWC Extension no longer manages this value');
                    yield config.update(constants_1.ESLINT_NODEPATH_CONFIG, undefined, vscode_1.ConfigurationTarget.Workspace);
                }
                catch (e) {
                    yield telemetry_1.telemetryService.sendException('lwc_eslint_nodepath_couldnt_be_set', e.message);
                }
            }
            // Activate Test support only for SFDX workspace type for now
            testSupport_1.activateLwcTestSupport(context);
        }
        // Notify telemetry that our extension is now active
        telemetry_1.telemetryService.sendExtensionActivationEvent(extensionHRStart).catch();
    });
}
exports.activate = activate;
function deactivate() {
    return __awaiter(this, void 0, void 0, function* () {
        if (devServerService_1.DevServerService.instance.isServerHandlerRegistered()) {
            yield devServerService_1.DevServerService.instance.stopServer();
        }
        console.log('Lightning Web Components Extension Deactivated');
        telemetry_1.telemetryService.sendExtensionDeactivationEvent().catch();
    });
}
exports.deactivate = deactivate;
function getActivationMode() {
    const config = vscode_1.workspace.getConfiguration('salesforcedx-vscode-lightning');
    return config.get('activationMode') || 'autodetect'; // default to autodetect
}
function registerCommands(extensionContext) {
    return vscode.Disposable.from(vscode.commands.registerCommand('sfdx.force.lightning.lwc.start', commands_1.forceLightningLwcStart), vscode.commands.registerCommand('sfdx.force.lightning.lwc.stop', commands_1.forceLightningLwcStop), vscode.commands.registerCommand('sfdx.force.lightning.lwc.open', commands_1.forceLightningLwcOpen), vscode.commands.registerCommand('sfdx.force.lightning.lwc.preview', commands_1.forceLightningLwcPreview));
}
function startLWCLanguageServer(context) {
    // Setup the language server
    const serverModule = context.asAbsolutePath(path.join('node_modules', '@salesforce', 'lwc-language-server', 'lib', 'server.js'));
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: debugOptions
        }
    };
    const clientOptions = {
        documentSelector: [
            { language: 'html', scheme: 'file' },
            { language: 'javascript', scheme: 'file' }
        ],
        synchronize: {
            fileEvents: [
                vscode_1.workspace.createFileSystemWatcher('**/*.resource'),
                vscode_1.workspace.createFileSystemWatcher('**/labels/CustomLabels.labels-meta.xml'),
                vscode_1.workspace.createFileSystemWatcher('**/staticresources/*.resource-meta.xml'),
                vscode_1.workspace.createFileSystemWatcher('**/contentassets/*.asset-meta.xml'),
                vscode_1.workspace.createFileSystemWatcher('**/lwc/*/*.js'),
                vscode_1.workspace.createFileSystemWatcher('**/modules/*/*/*.js'),
                // need to watch for directory deletions as no events are created for contents or deleted directories
                vscode_1.workspace.createFileSystemWatcher('**/', false, true, false)
            ]
        },
        uriConverters: {
            code2Protocol: code2ProtocolConverter,
            protocol2Code: protocol2CodeConverter
        }
    };
    // Create the language client and start the client.
    const client = new vscode_languageclient_1.LanguageClient('lwcLanguageServer', 'LWC Language Server', serverOptions, clientOptions).start();
    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(client);
}
//# sourceMappingURL=index.js.map