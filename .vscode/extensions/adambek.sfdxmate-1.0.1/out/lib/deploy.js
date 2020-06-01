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
const project_1 = require("./project");
const command_1 = require("./command");
/**
 * @description Deploy class for facilitating deployments to Salesforce orgs
 *
 */
class Deploy {
    static deployFile(textDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            const dirs = yield project_1.Project.getPackageDirectories();
            console.log('dirs: ' + dirs);
            // run when the docuement is saved
            const fileName = textDocument.fileName;
            console.log('textDocument file name: ' + fileName);
            if (dirs.some(dir => fileName.startsWith(dir))) {
                const deployCmd = command_1.Command.sourceDeploy(textDocument.fileName);
                command_1.Command.execute(deployCmd);
            }
        });
    }
}
exports.Deploy = Deploy;
//# sourceMappingURL=deploy.js.map