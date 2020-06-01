"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const moment = require("moment");
/**
 * @description Editor class for handling interactions with the VSCode editor
 *
 */
class Editor {
    static showOutput(outputMsg, hide) {
        this.outputChannel.appendLine(outputMsg);
        this.outputChannel.show(true);
        if (hide) {
            setTimeout(() => this.outputChannel.hide(), 1500);
        }
    }
    static showStatusInOutput(status) {
        this.showOutput('[STATUS]   SFDX Mate: Running...');
        this.showOutput('[' + moment().format('LTS') + '] ' + status);
        this.showOutput('');
    }
}
Editor.outputChannel = vscode_1.window.createOutputChannel('SFDX Mate');
exports.Editor = Editor;
//# sourceMappingURL=editor.js.map