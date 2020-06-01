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
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const config_1 = require("./lib/config");
const deploy_1 = require("./lib/deploy");
const editor_1 = require("./lib/editor");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sfdxmate" is now active!');
    // Display a message box to the user
    editor_1.Editor.showOutput('[STATUS]   SFDX Mate: Activating...');
    /* Show Default Username */
    let showDefaultUsername = vscode.commands.registerCommand('show.username', () => __awaiter(this, void 0, void 0, function* () {
        const username = yield config_1.Config.getDefaultUsername();
        vscode.window.showInformationMessage(`Default Username: ${username}`);
    }));
    context.subscriptions.push(showDefaultUsername);
    /* Show Default Dev Hub */
    let showDefaultDevHub = vscode.commands.registerCommand('show.devhub', () => __awaiter(this, void 0, void 0, function* () {
        const devHub = yield config_1.Config.getDefaultDevHub();
        vscode.window.showInformationMessage(`Default Dev Hub: ${devHub}`);
    }));
    context.subscriptions.push(showDefaultDevHub);
    /* Change Default Username */
    let changeDefaultUsername = vscode.commands.registerCommand('change.defaultorg', () => __awaiter(this, void 0, void 0, function* () {
        const orgs = yield config_1.Config.getOrgsList();
        let pickerOpts = [];
        orgs.forEach(org => {
            pickerOpts.push({
                label: org.alias,
                detail: 'Username: ' + org.username
            });
        });
        vscode.window.showQuickPick(pickerOpts, { placeHolder: 'Please pick a new default username.' })
            .then((selection) => __awaiter(this, void 0, void 0, function* () {
            if (selection) {
                yield config_1.Config.changeDefaultUsername(selection.label);
            }
            return selection;
        }))
            .then((selection) => __awaiter(this, void 0, void 0, function* () {
            if (selection) {
                const alias = yield config_1.Config.getDefaultUsername();
                if (selection.label === alias) {
                    vscode.window.showInformationMessage(`Changed Default Username to: ${alias}`);
                }
            }
        }));
    }));
    context.subscriptions.push(changeDefaultUsername);
    /* On Save Deploy */
    vscode.workspace.onDidSaveTextDocument(textDocument => {
        deploy_1.Deploy.deployFile(textDocument);
    });
    // welcome the user and update status
    editor_1.Editor.showOutput('[STATUS]   SFDX Mate: Initialized');
    editor_1.Editor.showOutput('', true);
    vscode.window.showInformationMessage('Hello from SFDX Mate!');
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map