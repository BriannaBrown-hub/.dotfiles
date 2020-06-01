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
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const vscode = require("vscode");
const channels_1 = require("./channels");
const commands_1 = require("./commands");
const forceStartApexDebugLogging_1 = require("./commands/forceStartApexDebugLogging");
const bootstrapCmd_1 = require("./commands/isvdebugging/bootstrapCmd");
const util_1 = require("./commands/util");
const conflict_1 = require("./conflict");
const context_1 = require("./context");
const decorators = require("./decorators");
const demo_mode_1 = require("./modes/demo-mode");
const notifications_1 = require("./notifications");
const orgBrowser_1 = require("./orgBrowser");
const orgPicker_1 = require("./orgPicker");
const settings_1 = require("./settings");
const statuses_1 = require("./statuses");
const telemetry_1 = require("./telemetry");
const util_2 = require("./util");
const authInfo_1 = require("./util/authInfo");
function registerCommands(extensionContext) {
    // Customer-facing commands
    const forceAuthWebLoginCmd = vscode.commands.registerCommand('sfdx.force.auth.web.login', commands_1.forceAuthWebLogin);
    const forceAuthDevHubCmd = vscode.commands.registerCommand('sfdx.force.auth.dev.hub', commands_1.forceAuthDevHub);
    const forceAuthLogoutAllCmd = vscode.commands.registerCommand('sfdx.force.auth.logout.all', commands_1.forceAuthLogoutAll);
    const forceOrgCreateCmd = vscode.commands.registerCommand('sfdx.force.org.create', commands_1.forceOrgCreate);
    const forceOrgOpenCmd = vscode.commands.registerCommand('sfdx.force.org.open', commands_1.forceOrgOpen);
    const forceSourceDeleteCmd = vscode.commands.registerCommand('sfdx.force.source.delete', commands_1.forceSourceDelete);
    const forceSourceDeleteCurrentFileCmd = vscode.commands.registerCommand('sfdx.force.source.delete.current.file', commands_1.forceSourceDelete);
    const forceSourceDeployCurrentSourceFileCmd = vscode.commands.registerCommand('sfdx.force.source.deploy.current.source.file', commands_1.forceSourceDeploySourcePath);
    const forceSourceDeployInManifestCmd = vscode.commands.registerCommand('sfdx.force.source.deploy.in.manifest', commands_1.forceSourceDeployManifest);
    const forceSourceDeployMultipleSourcePathsCmd = vscode.commands.registerCommand('sfdx.force.source.deploy.multiple.source.paths', commands_1.forceSourceDeployMultipleSourcePaths);
    const forceSourceDeploySourcePathCmd = vscode.commands.registerCommand('sfdx.force.source.deploy.source.path', commands_1.forceSourceDeploySourcePath);
    const forceSourcePullCmd = vscode.commands.registerCommand('sfdx.force.source.pull', commands_1.forceSourcePull);
    const forceSourcePullForceCmd = vscode.commands.registerCommand('sfdx.force.source.pull.force', commands_1.forceSourcePull, { flag: '--forceoverwrite' });
    const forceSourcePushCmd = vscode.commands.registerCommand('sfdx.force.source.push', commands_1.forceSourcePush);
    const forceSourcePushForceCmd = vscode.commands.registerCommand('sfdx.force.source.push.force', commands_1.forceSourcePush, { flag: '--forceoverwrite' });
    const forceSourceRetrieveCmd = vscode.commands.registerCommand('sfdx.force.source.retrieve.source.path', commands_1.forceSourceRetrieveSourcePath);
    const forceSourceRetrieveCurrentFileCmd = vscode.commands.registerCommand('sfdx.force.source.retrieve.current.source.file', commands_1.forceSourceRetrieveSourcePath);
    const forceSourceRetrieveInManifestCmd = vscode.commands.registerCommand('sfdx.force.source.retrieve.in.manifest', commands_1.forceSourceRetrieveManifest);
    const forceSourceStatusCmd = vscode.commands.registerCommand('sfdx.force.source.status', commands_1.forceSourceStatus);
    const forceSourceStatusLocalCmd = vscode.commands.registerCommand('sfdx.force.source.status.local', commands_1.forceSourceStatus, { flag: '--local' });
    const forceSourceStatusRemoteCmd = vscode.commands.registerCommand('sfdx.force.source.status.remote', commands_1.forceSourceStatus, { flag: '--remote' });
    const forceApexTestRunCmd = vscode.commands.registerCommand('sfdx.force.apex.test.run', commands_1.forceApexTestRun);
    const forceTaskStopCmd = vscode.commands.registerCommand('sfdx.force.task.stop', commands_1.forceTaskStop);
    const forceApexClassCreateCmd = vscode.commands.registerCommand('sfdx.force.apex.class.create', commands_1.forceApexClassCreate);
    const forceAnalyticsTemplateCreateCmd = vscode.commands.registerCommand('sfdx.force.analytics.template.create', commands_1.forceAnalyticsTemplateCreate);
    const forceVisualforceComponentCreateCmd = vscode.commands.registerCommand('sfdx.force.visualforce.component.create', commands_1.forceVisualforceComponentCreate);
    const forceVisualforcePageCreateCmd = vscode.commands.registerCommand('sfdx.force.visualforce.page.create', commands_1.forceVisualforcePageCreate);
    const forceLightningAppCreateCmd = vscode.commands.registerCommand('sfdx.force.lightning.app.create', commands_1.forceLightningAppCreate);
    const forceLightningComponentCreateCmd = vscode.commands.registerCommand('sfdx.force.lightning.component.create', commands_1.forceLightningComponentCreate);
    const forceLightningEventCreateCmd = vscode.commands.registerCommand('sfdx.force.lightning.event.create', commands_1.forceLightningEventCreate);
    const forceLightningInterfaceCreateCmd = vscode.commands.registerCommand('sfdx.force.lightning.interface.create', commands_1.forceLightningInterfaceCreate);
    const forceLightningLwcCreateCmd = vscode.commands.registerCommand('sfdx.force.lightning.lwc.create', commands_1.forceLightningLwcCreate);
    const forceDebuggerStopCmd = vscode.commands.registerCommand('sfdx.force.debugger.stop', commands_1.forceDebuggerStop);
    const forceConfigListCmd = vscode.commands.registerCommand('sfdx.force.config.list', commands_1.forceConfigList);
    const forceAliasListCmd = vscode.commands.registerCommand('sfdx.force.alias.list', commands_1.forceAliasList);
    const forceOrgDisplayDefaultCmd = vscode.commands.registerCommand('sfdx.force.org.display.default', commands_1.forceOrgDisplay);
    const forceOrgDisplayUsernameCmd = vscode.commands.registerCommand('sfdx.force.org.display.username', commands_1.forceOrgDisplay, { flag: '--targetusername' });
    const forceDataSoqlQueryInputCmd = vscode.commands.registerCommand('sfdx.force.data.soql.query.input', commands_1.forceDataSoqlQuery);
    const forceDataSoqlQuerySelectionCmd = vscode.commands.registerCommand('sfdx.force.data.soql.query.selection', commands_1.forceDataSoqlQuery);
    const forceApexExecuteDocumentCmd = vscode.commands.registerCommand('sfdx.force.apex.execute.document', commands_1.forceApexExecute, false);
    const forceApexExecuteSelectionCmd = vscode.commands.registerCommand('sfdx.force.apex.execute.selection', commands_1.forceApexExecute, true);
    const forceProjectCreateCmd = vscode.commands.registerCommand('sfdx.force.project.create', commands_1.forceSfdxProjectCreate);
    const forceProjectWithManifestCreateCmd = vscode.commands.registerCommand('sfdx.force.project.with.manifest.create', commands_1.forceProjectWithManifestCreate);
    const forceApexTriggerCreateCmd = vscode.commands.registerCommand('sfdx.force.apex.trigger.create', commands_1.forceApexTriggerCreate);
    const forceStartApexDebugLoggingCmd = vscode.commands.registerCommand('sfdx.force.start.apex.debug.logging', commands_1.forceStartApexDebugLogging);
    const forceStopApexDebugLoggingCmd = vscode.commands.registerCommand('sfdx.force.stop.apex.debug.logging', commands_1.forceStopApexDebugLogging);
    const isvDebugBootstrapCmd = vscode.commands.registerCommand('sfdx.debug.isv.bootstrap', bootstrapCmd_1.isvDebugBootstrap);
    const forceApexLogGetCmd = vscode.commands.registerCommand('sfdx.force.apex.log.get', commands_1.forceApexLogGet);
    const forceConfigSetCmd = vscode.commands.registerCommand('sfdx.force.config.set', commands_1.forceConfigSet);
    const forceDiffFile = vscode.commands.registerCommand('sfdx.force.diff', commands_1.forceSourceDiff);
    return vscode.Disposable.from(forceApexExecuteDocumentCmd, forceApexExecuteSelectionCmd, forceApexTestRunCmd, forceAuthWebLoginCmd, forceAuthDevHubCmd, forceAuthLogoutAllCmd, forceDataSoqlQueryInputCmd, forceDataSoqlQuerySelectionCmd, forceDiffFile, forceOrgCreateCmd, forceOrgOpenCmd, forceSourceDeleteCmd, forceSourceDeleteCurrentFileCmd, forceSourceDeployCurrentSourceFileCmd, forceSourceDeployInManifestCmd, forceSourceDeployMultipleSourcePathsCmd, forceSourceDeploySourcePathCmd, forceSourcePullCmd, forceSourcePullForceCmd, forceSourcePushCmd, forceSourcePushForceCmd, forceSourceRetrieveCmd, forceSourceRetrieveCurrentFileCmd, forceSourceRetrieveInManifestCmd, forceSourceStatusCmd, forceTaskStopCmd, forceApexClassCreateCmd, forceAnalyticsTemplateCreateCmd, forceVisualforceComponentCreateCmd, forceVisualforcePageCreateCmd, forceLightningAppCreateCmd, forceLightningComponentCreateCmd, forceLightningEventCreateCmd, forceLightningInterfaceCreateCmd, forceLightningLwcCreateCmd, forceSourceStatusLocalCmd, forceSourceStatusRemoteCmd, forceDebuggerStopCmd, forceConfigListCmd, forceAliasListCmd, forceOrgDisplayDefaultCmd, forceOrgDisplayUsernameCmd, forceProjectCreateCmd, forceProjectWithManifestCreateCmd, forceApexTriggerCreateCmd, forceStartApexDebugLoggingCmd, forceStopApexDebugLoggingCmd, isvDebugBootstrapCmd, forceApexLogGetCmd, forceConfigSetCmd);
}
function registerInternalDevCommands(extensionContext) {
    const forceInternalLightningAppCreateCmd = vscode.commands.registerCommand('sfdx.internal.lightning.app.create', commands_1.forceInternalLightningAppCreate);
    const forceInternalLightningComponentCreateCmd = vscode.commands.registerCommand('sfdx.internal.lightning.component.create', commands_1.forceInternalLightningComponentCreate);
    const forceInternalLightningEventCreateCmd = vscode.commands.registerCommand('sfdx.internal.lightning.event.create', commands_1.forceInternalLightningEventCreate);
    const forceInternalLightningInterfaceCreateCmd = vscode.commands.registerCommand('sfdx.internal.lightning.interface.create', commands_1.forceInternalLightningInterfaceCreate);
    const forceInternalLightningLwcCreateCmd = vscode.commands.registerCommand('sfdx.internal.lightning.lwc.create', commands_1.forceInternalLightningLwcCreate);
    return vscode.Disposable.from(forceInternalLightningComponentCreateCmd, forceInternalLightningLwcCreateCmd, forceInternalLightningAppCreateCmd, forceInternalLightningEventCreateCmd, forceInternalLightningInterfaceCreateCmd);
}
function registerOrgPickerCommands(orgList) {
    const forceSetDefaultOrgCmd = vscode.commands.registerCommand('sfdx.force.set.default.org', () => orgList.setDefaultOrg());
    return vscode.Disposable.from(forceSetDefaultOrgCmd);
}
function setupOrgBrowser(extensionContext) {
    return __awaiter(this, void 0, void 0, function* () {
        yield orgBrowser_1.orgBrowser.init(extensionContext);
        vscode.commands.registerCommand('sfdx.force.metadata.view.type.refresh', (node) => __awaiter(this, void 0, void 0, function* () {
            yield orgBrowser_1.orgBrowser.refreshAndExpand(node);
        }));
        vscode.commands.registerCommand('sfdx.force.metadata.view.component.refresh', (node) => __awaiter(this, void 0, void 0, function* () {
            yield orgBrowser_1.orgBrowser.refreshAndExpand(node);
        }));
        vscode.commands.registerCommand('sfdx.force.source.retrieve.component', (trigger) => __awaiter(this, void 0, void 0, function* () {
            yield commands_1.forceSourceRetrieveCmp(trigger);
        }));
    });
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const extensionHRStart = process.hrtime();
        const machineId = vscode && vscode.env ? vscode.env.machineId : 'someValue.machineId';
        yield telemetry_1.telemetryService.initializeService(context, machineId);
        telemetry_1.telemetryService.showTelemetryMessage();
        // Task View
        const treeDataProvider = vscode.window.registerTreeDataProvider('sfdx.force.tasks.view', statuses_1.taskViewService);
        context.subscriptions.push(treeDataProvider);
        // Set internal dev context
        const internalDev = settings_1.sfdxCoreSettings.getInternalDev();
        vscode.commands.executeCommand('setContext', 'sfdx:internal_dev', internalDev);
        if (internalDev) {
            // Internal Dev commands
            const internalCommands = registerInternalDevCommands(context);
            context.subscriptions.push(internalCommands);
            // Api
            const internalApi = {
                channelService: channels_1.channelService,
                EmptyParametersGatherer: util_1.EmptyParametersGatherer,
                isCLIInstalled: util_2.isCLIInstalled,
                notificationService: notifications_1.notificationService,
                OrgAuthInfo: authInfo_1.OrgAuthInfo,
                ProgressNotification: notifications_1.ProgressNotification,
                SfdxCommandlet: util_1.SfdxCommandlet,
                SfdxCommandletExecutor: util_1.SfdxCommandletExecutor,
                sfdxCoreSettings: settings_1.sfdxCoreSettings,
                SfdxWorkspaceChecker: util_1.SfdxWorkspaceChecker,
                telemetryService: telemetry_1.telemetryService
            };
            if (!util_2.isCLIInstalled()) {
                util_2.showCLINotInstalledMessage();
                telemetry_1.telemetryService.sendException('core_internal_no_cli', 'Salesforce CLI is not installed, internal dev mode');
            }
            telemetry_1.telemetryService.sendExtensionActivationEvent(extensionHRStart);
            console.log('SFDX CLI Extension Activated (internal dev mode)');
            return internalApi;
        }
        // Context
        let sfdxProjectOpened = false;
        if (util_2.hasRootWorkspace()) {
            const files = yield vscode.workspace.findFiles('**/sfdx-project.json');
            sfdxProjectOpened = files && files.length > 0;
        }
        let replayDebuggerExtensionInstalled = false;
        if (vscode.extensions.getExtension('salesforce.salesforcedx-vscode-apex-replay-debugger')) {
            replayDebuggerExtensionInstalled = true;
        }
        vscode.commands.executeCommand('setContext', 'sfdx:replay_debugger_extension', replayDebuggerExtensionInstalled);
        vscode.commands.executeCommand('setContext', 'sfdx:project_opened', sfdxProjectOpened);
        let defaultUsernameorAlias;
        if (util_2.hasRootWorkspace()) {
            defaultUsernameorAlias = yield authInfo_1.OrgAuthInfo.getDefaultUsernameOrAlias(false);
        }
        // register org picker commands and set up filewatcher for defaultusername
        const orgList = new orgPicker_1.OrgList();
        orgList.displayDefaultUsername(defaultUsernameorAlias);
        context.subscriptions.push(registerOrgPickerCommands(orgList));
        yield setupOrgBrowser(context);
        yield conflict_1.setupConflictView(context);
        if (util_2.isCLIInstalled()) {
            // Set context for defaultusername org
            yield context_1.setupWorkspaceOrgType(defaultUsernameorAlias);
            yield orgList.registerDefaultUsernameWatcher(context);
        }
        else {
            util_2.showCLINotInstalledMessage();
            telemetry_1.telemetryService.sendException('core_no_cli', 'Salesforce CLI is not installed');
        }
        // Register filewatcher for push or deploy on save
        yield settings_1.registerPushOrDeployOnSave();
        // Commands
        const commands = registerCommands(context);
        context.subscriptions.push(commands);
        context.subscriptions.push(conflict_1.registerConflictView());
        // Scratch Org Decorator
        if (util_2.hasRootWorkspace()) {
            decorators.showOrg();
            decorators.monitorOrgConfigChanges();
        }
        // Demo mode Decorator
        if (util_2.hasRootWorkspace() && demo_mode_1.isDemoMode()) {
            decorators.showDemoMode();
        }
        const api = {
            channelService: channels_1.channelService,
            CompositeParametersGatherer: util_1.CompositeParametersGatherer,
            EmptyParametersGatherer: util_1.EmptyParametersGatherer,
            getDefaultUsernameOrAlias: context_1.getDefaultUsernameOrAlias,
            getUserId: forceStartApexDebugLogging_1.getUserId,
            isCLIInstalled: util_2.isCLIInstalled,
            notificationService: notifications_1.notificationService,
            OrgAuthInfo: authInfo_1.OrgAuthInfo,
            ProgressNotification: notifications_1.ProgressNotification,
            SelectFileName: util_1.SelectFileName,
            SelectOutputDir: util_1.SelectOutputDir,
            SfdxCommandlet: util_1.SfdxCommandlet,
            SfdxCommandletExecutor: util_1.SfdxCommandletExecutor,
            sfdxCoreSettings: settings_1.sfdxCoreSettings,
            SfdxWorkspaceChecker: util_1.SfdxWorkspaceChecker,
            taskViewService: statuses_1.taskViewService,
            telemetryService: telemetry_1.telemetryService
        };
        telemetry_1.telemetryService.sendExtensionActivationEvent(extensionHRStart);
        console.log('SFDX CLI Extension Activated');
        return api;
    });
}
exports.activate = activate;
function deactivate() {
    console.log('SFDX CLI Extension Deactivated');
    // Send metric data.
    telemetry_1.telemetryService.sendExtensionDeactivationEvent();
    telemetry_1.telemetryService.dispose();
    decorators.disposeTraceFlagExpiration();
    return commands_1.turnOffLogging();
}
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map