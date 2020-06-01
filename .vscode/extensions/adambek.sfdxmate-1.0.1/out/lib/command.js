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
const child_process_1 = require("child_process");
const editor_1 = require("./editor");
const project_1 = require("./project");
/**
 * @description Command class for handling the construciton and execution of CLI commands
 *
 */
class Command {
    /* CONSTRUCTION METHODS */
    static sourceCommand() {
        return this.sfdxForceCmd + 'source:';
    }
    static sourceDeploy(filePath) {
        return this.sourceCommand() + 'deploy -p ' + filePath;
    }
    /* EXECUTION METHODS */
    static execute(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            const rootPath = yield project_1.Project.getRootPath();
            // show the command executing
            editor_1.Editor.showStatusInOutput(cmd);
            child_process_1.exec(`cd "${rootPath}" && ${cmd}`, (err, stdout, stderr) => {
                if (err) {
                    editor_1.Editor.showOutput(stdout);
                }
                else {
                    editor_1.Editor.showOutput(stdout, true);
                }
            });
        });
    }
}
Command.sfdxForceCmd = 'sfdx force:';
exports.Command = Command;
//# sourceMappingURL=command.js.map