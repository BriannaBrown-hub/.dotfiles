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
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const vscode = require("vscode");
const messages_1 = require("../../messages");
const util_1 = require("../util");
const baseTemplateCommand_1 = require("./baseTemplateCommand");
const metadataTypeConstants_1 = require("./metadataTypeConstants");
class ForceAnalyticsTemplateCreateExecutor extends baseTemplateCommand_1.BaseTemplateCommand {
    constructor() {
        super(metadataTypeConstants_1.ANALYTICS_TEMPLATE_TYPE);
        this.sourcePathStrategy = util_1.PathStrategyFactory.createWaveTemplateBundleStrategy();
    }
    getFileExtension() {
        return '.json';
    }
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_analytics_template_create_text'))
            .withArg('force:analytics:template:create')
            .withFlag('--outputdir', data.outputdir)
            .withFlag('--templatename', data.fileName)
            .withLogName('force_analytics_template_create')
            .build();
    }
    getDefaultDirectory() {
        return metadataTypeConstants_1.ANALYTICS_TEMPLATE_DIRECTORY;
    }
}
exports.ForceAnalyticsTemplateCreateExecutor = ForceAnalyticsTemplateCreateExecutor;
class SelectProjectTemplate {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const projectTemplateInputOptions = {
                prompt: messages_1.nls.localize('force_analytics_template_name_text')
            };
            const fileName = yield vscode.window.showInputBox(projectTemplateInputOptions);
            return fileName
                ? { type: 'CONTINUE', data: { fileName } }
                : { type: 'CANCEL' };
        });
    }
}
exports.SelectProjectTemplate = SelectProjectTemplate;
const outputDirGatherer = new util_1.SelectOutputDir(metadataTypeConstants_1.ANALYTICS_TEMPLATE_DIRECTORY);
const parameterGatherer = new util_1.CompositeParametersGatherer(new SelectProjectTemplate(), outputDirGatherer);
function forceAnalyticsTemplateCreate() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), parameterGatherer, new ForceAnalyticsTemplateCreateExecutor());
        yield commandlet.run();
    });
}
exports.forceAnalyticsTemplateCreate = forceAnalyticsTemplateCreate;
//# sourceMappingURL=forceAnalyticsTemplateCreate.js.map