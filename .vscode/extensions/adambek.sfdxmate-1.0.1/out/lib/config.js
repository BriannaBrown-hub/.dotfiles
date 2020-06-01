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
const sfcore = require("@salesforce/core");
const project_1 = require("./project");
/**
 * @description Config class for handling interations with the SFDX config settings
 *
 */
class Config {
    static getOrgsList() {
        return __awaiter(this, void 0, void 0, function* () {
            const orgs = [];
            // returns a list of username auth files
            const authFiles = yield sfcore.AuthInfo.listAllAuthFiles();
            const usernames = authFiles.map(authfile => authfile.replace('.json', ''));
            const aliases = yield sfcore.Aliases.create(sfcore.Aliases.getDefaultOptions());
            // Map the aliases onto the usernames
            for (const username of usernames) {
                let alias = aliases.getKeysByValue(username)[0];
                if (alias) {
                    orgs.push({
                        alias: alias,
                        username: username
                    });
                }
            }
            return orgs;
        });
    }
    static getDefaultUsername() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultKey = 'defaultusername';
            return yield this.getDefaultUsernames(defaultKey);
        });
    }
    static getDefaultDevHub() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultKey = 'defaultdevhubusername';
            return yield this.getDefaultUsernames(defaultKey);
        });
    }
    static getDefaultUsernames(defaultKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const rootPath = yield project_1.Project.getRootPath();
            if (rootPath) {
                const defaultUsernames = yield sfcore.fs.readJsonMap(rootPath + this.dot_sfdx_dir + sfcore.Config.getFileName());
                return defaultKey ? defaultUsernames[defaultKey] : defaultUsernames;
            }
            else {
                return undefined;
            }
        });
    }
    static changeDefaultUsername(newDefault) {
        return __awaiter(this, void 0, void 0, function* () {
            const rootPath = yield project_1.Project.getRootPath();
            const localPath = rootPath + this.dot_sfdx_dir + sfcore.Config.getFileName();
            const localConfig = yield sfcore.fs.readJsonMap(localPath);
            localConfig.defaultusername = newDefault;
            yield sfcore.fs.writeJson(localPath, localConfig);
        });
    }
}
Config.dot_sfdx_dir = '.sfdx/';
exports.Config = Config;
//# sourceMappingURL=config.js.map