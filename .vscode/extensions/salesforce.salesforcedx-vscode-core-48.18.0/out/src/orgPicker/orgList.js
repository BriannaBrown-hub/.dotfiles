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
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const core_1 = require("@salesforce/core");
const fs_1 = require("fs");
const path = require("path");
const util_1 = require("util");
const vscode = require("vscode");
const index_1 = require("../context/index");
const messages_1 = require("../messages");
const telemetry_1 = require("../telemetry");
const util_2 = require("../util");
class OrgList {
    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 49);
        this.statusBarItem.command = 'sfdx.force.set.default.org';
        this.statusBarItem.show();
    }
    displayDefaultUsername(defaultUsernameorAlias) {
        if (!util_1.isNullOrUndefined(defaultUsernameorAlias)) {
            this.statusBarItem.text = `$(plug) ${defaultUsernameorAlias}`;
        }
        else {
            this.statusBarItem.text = messages_1.nls.localize('missing_default_org');
        }
    }
    getAuthInfoObjects() {
        return __awaiter(this, void 0, void 0, function* () {
            const authFilesArray = yield core_1.AuthInfo.listAllAuthFiles().catch(err => null);
            if (authFilesArray === null || authFilesArray.length === 0) {
                return null;
            }
            const authInfoObjects = [];
            for (const username of authFilesArray) {
                try {
                    const filePath = path.join(yield core_1.AuthInfoConfig.resolveRootFolder(true), '.sfdx', username);
                    const fileData = fs_1.readFileSync(filePath, 'utf8');
                    authInfoObjects.push(JSON.parse(fileData));
                }
                catch (e) {
                    console.log(e);
                }
            }
            return authInfoObjects;
        });
    }
    filterAuthInfo(authInfoObjects) {
        return __awaiter(this, void 0, void 0, function* () {
            authInfoObjects = authInfoObjects.filter(fileData => util_1.isNullOrUndefined(fileData.scratchAdminUsername));
            const defaultDevHubUsernameorAlias = yield this.getDefaultDevHubUsernameorAlias();
            if (defaultDevHubUsernameorAlias) {
                const defaultDevHubUsername = yield util_2.OrgAuthInfo.getUsername(defaultDevHubUsernameorAlias);
                authInfoObjects = authInfoObjects.filter(fileData => util_1.isNullOrUndefined(fileData.devHubUsername) ||
                    (!util_1.isNullOrUndefined(fileData.devHubUsername) &&
                        fileData.devHubUsername === defaultDevHubUsername));
            }
            const authUsernames = authInfoObjects.map(file => file.username);
            const aliases = yield core_1.Aliases.create(core_1.Aliases.getDefaultOptions());
            const authList = [];
            for (const username of authUsernames) {
                const alias = yield aliases.getKeysByValue(username);
                if (alias.length > 0) {
                    authList.push(alias + ' - ' + username);
                }
                else {
                    authList.push(username);
                }
            }
            return authList;
        });
    }
    updateOrgList() {
        return __awaiter(this, void 0, void 0, function* () {
            const authInfoObjects = yield this.getAuthInfoObjects();
            if (util_1.isNullOrUndefined(authInfoObjects)) {
                return null;
            }
            const authUsernameList = yield this.filterAuthInfo(authInfoObjects);
            return authUsernameList;
        });
    }
    setDefaultOrg() {
        return __awaiter(this, void 0, void 0, function* () {
            let quickPickList = [
                '$(plus) ' + messages_1.nls.localize('force_auth_web_login_authorize_org_text'),
                '$(plus) ' + messages_1.nls.localize('force_auth_web_login_authorize_dev_hub_text'),
                '$(plus) ' + messages_1.nls.localize('force_org_create_default_scratch_org_text')
            ];
            const authInfoList = yield this.updateOrgList();
            if (!util_1.isNullOrUndefined(authInfoList)) {
                quickPickList = quickPickList.concat(authInfoList);
            }
            const selection = yield vscode.window.showQuickPick(quickPickList, {
                placeHolder: messages_1.nls.localize('org_select_text')
            });
            if (!selection) {
                return { type: 'CANCEL' };
            }
            switch (selection) {
                case '$(plus) ' +
                    messages_1.nls.localize('force_auth_web_login_authorize_org_text'):
                    {
                        vscode.commands.executeCommand('sfdx.force.auth.web.login');
                        return {
                            type: 'CONTINUE',
                            data: {}
                        };
                    }
                case '$(plus) ' +
                    messages_1.nls.localize('force_auth_web_login_authorize_dev_hub_text'):
                    {
                        vscode.commands.executeCommand('sfdx.force.auth.dev.hub');
                        return { type: 'CONTINUE', data: {} };
                    }
                case '$(plus) ' +
                    messages_1.nls.localize('force_org_create_default_scratch_org_text'):
                    {
                        vscode.commands.executeCommand('sfdx.force.org.create');
                        return { type: 'CONTINUE', data: {} };
                    }
                default: {
                    const usernameOrAlias = selection.split(' - ', 1);
                    vscode.commands.executeCommand('sfdx.force.config.set', usernameOrAlias);
                    return { type: 'CONTINUE', data: {} };
                }
            }
        });
    }
    getDefaultDevHubUsernameorAlias() {
        return __awaiter(this, void 0, void 0, function* () {
            if (util_2.hasRootWorkspace()) {
                return util_2.OrgAuthInfo.getDefaultDevHubUsernameOrAlias(false);
            }
        });
    }
    dispose() {
        this.statusBarItem.dispose();
    }
    onSfdxConfigEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            let defaultUsernameorAlias;
            if (util_2.hasRootWorkspace()) {
                defaultUsernameorAlias = yield util_2.OrgAuthInfo.getDefaultUsernameOrAlias(false);
            }
            telemetry_1.telemetryService.sendEventData('Sfdx-config file updated with default username', undefined, { timestamp: new Date().getTime() });
            yield index_1.setupWorkspaceOrgType(defaultUsernameorAlias);
            this.displayDefaultUsername(defaultUsernameorAlias);
        });
    }
    registerDefaultUsernameWatcher(context) {
        if (util_2.hasRootWorkspace()) {
            const sfdxConfigWatcher = vscode.workspace.createFileSystemWatcher(path.join(util_2.getRootWorkspacePath(), '.sfdx', 'sfdx-config.json'));
            sfdxConfigWatcher.onDidChange(uri => this.onSfdxConfigEvent());
            sfdxConfigWatcher.onDidCreate(uri => this.onSfdxConfigEvent());
            sfdxConfigWatcher.onDidDelete(uri => this.onSfdxConfigEvent());
            context.subscriptions.push(sfdxConfigWatcher);
        }
    }
}
exports.OrgList = OrgList;
//# sourceMappingURL=orgList.js.map