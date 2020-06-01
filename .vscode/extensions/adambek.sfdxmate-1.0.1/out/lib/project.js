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
const vscode = require("vscode");
const core_1 = require("@salesforce/core");
/**
 * @description Project class for hanlding interations with the project configuration
 *
 */
class Project {
    static getRootPath() {
        return __awaiter(this, void 0, void 0, function* () {
            return vscode.workspace.workspaceFolders
                ? vscode.workspace.workspaceFolders[0].uri.fsPath + '/'
                : undefined;
        });
    }
    static getProjectJson() {
        return __awaiter(this, void 0, void 0, function* () {
            const rootPath = yield this.getRootPath();
            return rootPath
                ? yield core_1.SfdxProject.resolve(rootPath)
                : undefined;
        });
    }
    static getProjectConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const projectJson = yield this.getProjectJson();
            return yield projectJson.resolveProjectConfig();
        });
    }
    static getPackageDirectories() {
        return __awaiter(this, void 0, void 0, function* () {
            const projectConfig = yield this.getProjectConfig();
            const dirs = [];
            if (projectConfig) {
                const rootPath = yield this.getRootPath();
                const packageDirectories = yield projectConfig.packageDirectories;
                packageDirectories.forEach((dir) => {
                    dirs.push(rootPath + dir.path);
                });
            }
            return dirs;
        });
    }
}
exports.Project = Project;
//# sourceMappingURL=project.js.map