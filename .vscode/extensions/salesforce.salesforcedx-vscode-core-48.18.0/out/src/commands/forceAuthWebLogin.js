"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
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
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const cli_2 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const cli_3 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const vscode_1 = require("vscode");
const index_1 = require("../channels/index");
const messages_1 = require("../messages");
const demo_mode_1 = require("../modes/demo-mode");
const index_2 = require("../notifications/index");
const sfdxProject_1 = require("../sfdxProject");
const index_3 = require("../statuses/index");
const util_1 = require("../util");
const forceAuthLogout_1 = require("./forceAuthLogout");
const util_2 = require("./util");
exports.DEFAULT_ALIAS = 'vscodeOrg';
exports.PRODUCTION_URL = 'https://login.salesforce.com';
exports.SANDBOX_URL = 'https://test.salesforce.com';
class ForceAuthWebLoginExecutor extends util_2.SfdxCommandletExecutor {
    constructor() {
        super(...arguments);
        this.showChannelOutput = util_1.isSFDXContainerMode();
    }
    build(data) {
        const command = new cli_1.SfdxCommandBuilder().withDescription(messages_1.nls.localize('force_auth_web_login_authorize_org_text'));
        if (util_1.isSFDXContainerMode()) {
            command
                .withArg('force:auth:device:login')
                .withLogName('force_auth_device_login');
        }
        else {
            command
                .withArg('force:auth:web:login')
                .withLogName('force_auth_web_login');
        }
        command
            .withFlag('--setalias', data.alias)
            .withFlag('--instanceurl', data.loginUrl)
            .withArg('--setdefaultusername');
        return command.build();
    }
}
exports.ForceAuthWebLoginExecutor = ForceAuthWebLoginExecutor;
class ForceAuthDemoModeExecutor extends util_2.SfdxCommandletExecutor {
    execute(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = process.hrtime();
            const cancellationTokenSource = new vscode_1.CancellationTokenSource();
            const cancellationToken = cancellationTokenSource.token;
            const execution = new cli_3.CliCommandExecutor(this.build(response.data), {
                cwd: util_1.getRootWorkspacePath()
            }).execute(cancellationToken);
            execution.processExitSubject.subscribe(() => {
                this.logMetric(execution.command.logName, startTime);
            });
            index_2.notificationService.reportExecutionError(execution.command.toString(), execution.stderrSubject);
            index_1.channelService.streamCommandOutput(execution);
            index_2.ProgressNotification.show(execution, cancellationTokenSource);
            index_3.taskViewService.addCommandExecution(execution, cancellationTokenSource);
            try {
                const result = yield new cli_2.CommandOutput().getCmdResult(execution);
                if (demo_mode_1.isProdOrg(JSON.parse(result))) {
                    yield promptLogOutForProdOrg();
                }
                else {
                    yield index_2.notificationService.showSuccessfulExecution(execution.command.toString());
                }
                return Promise.resolve();
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
}
exports.ForceAuthDemoModeExecutor = ForceAuthDemoModeExecutor;
class ForceAuthWebLoginDemoModeExecutor extends ForceAuthDemoModeExecutor {
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_auth_web_login_authorize_org_text'))
            .withArg('force:auth:web:login')
            .withFlag('--setalias', data.alias)
            .withFlag('--instanceurl', data.loginUrl)
            .withArg('--setdefaultusername')
            .withArg('--noprompt')
            .withJson()
            .withLogName('force_auth_web_login_demo_mode')
            .build();
    }
}
exports.ForceAuthWebLoginDemoModeExecutor = ForceAuthWebLoginDemoModeExecutor;
class OrgTypeItem {
    constructor(localizeLabel, localizeDetail) {
        this.label = messages_1.nls.localize(localizeLabel);
        this.detail = messages_1.nls.localize(localizeDetail);
    }
}
exports.OrgTypeItem = OrgTypeItem;
class AuthParamsGatherer {
    constructor() {
        this.orgTypes = {
            project: new OrgTypeItem('auth_project_label', 'auth_project_detail'),
            production: new OrgTypeItem('auth_prod_label', 'auth_prod_detail'),
            sandbox: new OrgTypeItem('auth_sandbox_label', 'auth_sandbox_detail'),
            custom: new OrgTypeItem('auth_custom_label', 'auth_custom_detail')
        };
    }
    getProjectLoginUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield sfdxProject_1.SfdxProjectConfig.getValue('sfdcLoginUrl'));
        });
    }
    getQuickPickItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const projectUrl = yield this.getProjectLoginUrl();
            const items = [
                this.orgTypes.production,
                this.orgTypes.sandbox,
                this.orgTypes.custom
            ];
            if (projectUrl) {
                const { project } = this.orgTypes;
                project.detail = `${messages_1.nls.localize('auth_project_detail')} (${projectUrl})`;
                items.unshift(project);
            }
            return items;
        });
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const quickPickItems = yield this.getQuickPickItems();
            const selection = yield vscode.window.showQuickPick(quickPickItems);
            if (!selection) {
                return { type: 'CANCEL' };
            }
            const orgType = selection.label;
            let loginUrl;
            if (orgType === this.orgTypes.custom.label) {
                const customUrlInputOptions = {
                    prompt: messages_1.nls.localize('parameter_gatherer_enter_custom_url'),
                    placeHolder: exports.PRODUCTION_URL,
                    validateInput: AuthParamsGatherer.validateUrl
                };
                loginUrl = yield vscode.window.showInputBox(customUrlInputOptions);
                if (loginUrl === undefined) {
                    return { type: 'CANCEL' };
                }
            }
            else if (orgType === this.orgTypes.project.label) {
                loginUrl = yield this.getProjectLoginUrl();
            }
            else {
                loginUrl = orgType === 'Sandbox' ? exports.SANDBOX_URL : exports.PRODUCTION_URL;
            }
            const aliasInputOptions = {
                prompt: messages_1.nls.localize('parameter_gatherer_enter_alias_name'),
                placeHolder: exports.DEFAULT_ALIAS
            };
            const alias = yield vscode.window.showInputBox(aliasInputOptions);
            // Hitting enter with no alias will default the alias to 'vscodeOrg'
            if (alias === undefined) {
                return { type: 'CANCEL' };
            }
            return {
                type: 'CONTINUE',
                data: {
                    alias: alias || exports.DEFAULT_ALIAS,
                    loginUrl: loginUrl || exports.PRODUCTION_URL
                }
            };
        });
    }
}
AuthParamsGatherer.validateUrl = (url) => {
    const expr = /https?:\/\/(.*)/;
    if (expr.test(url)) {
        return null;
    }
    return messages_1.nls.localize('auth_invalid_url');
};
exports.AuthParamsGatherer = AuthParamsGatherer;
function promptLogOutForProdOrg() {
    return __awaiter(this, void 0, void 0, function* () {
        yield new util_2.SfdxCommandlet(new util_2.SfdxWorkspaceChecker(), new util_2.DemoModePromptGatherer(), forceAuthLogout_1.ForceAuthLogoutAll.withoutShowingChannel()).run();
    });
}
exports.promptLogOutForProdOrg = promptLogOutForProdOrg;
const workspaceChecker = new util_2.SfdxWorkspaceChecker();
const parameterGatherer = new AuthParamsGatherer();
function createExecutor() {
    return demo_mode_1.isDemoMode()
        ? new ForceAuthWebLoginDemoModeExecutor()
        : new ForceAuthWebLoginExecutor();
}
exports.createExecutor = createExecutor;
function forceAuthWebLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_2.SfdxCommandlet(workspaceChecker, parameterGatherer, createExecutor());
        yield commandlet.run();
    });
}
exports.forceAuthWebLogin = forceAuthWebLogin;
//# sourceMappingURL=forceAuthWebLogin.js.map