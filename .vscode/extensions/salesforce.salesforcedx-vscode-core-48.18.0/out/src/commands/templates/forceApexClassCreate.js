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
const messages_1 = require("../../messages");
const util_1 = require("../util");
const postconditionCheckers_1 = require("../util/postconditionCheckers");
const baseTemplateCommand_1 = require("./baseTemplateCommand");
const metadataTypeConstants_1 = require("./metadataTypeConstants");
class ForceApexClassCreateExecutor extends baseTemplateCommand_1.BaseTemplateCommand {
    constructor() {
        super(metadataTypeConstants_1.APEX_CLASS_TYPE);
    }
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_apex_class_create_text'))
            .withArg('force:apex:class:create')
            .withFlag('--classname', data.fileName)
            .withFlag('--template', 'DefaultApexClass')
            .withFlag('--outputdir', data.outputdir)
            .withLogName('force_apex_class_create')
            .build();
    }
}
exports.ForceApexClassCreateExecutor = ForceApexClassCreateExecutor;
const fileNameGatherer = new util_1.SelectFileName();
const outputDirGatherer = new util_1.SelectOutputDir(metadataTypeConstants_1.APEX_CLASS_DIRECTORY);
const metadataTypeGatherer = new util_1.MetadataTypeGatherer(metadataTypeConstants_1.APEX_CLASS_TYPE);
function forceApexClassCreate() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), new util_1.CompositeParametersGatherer(metadataTypeGatherer, fileNameGatherer, outputDirGatherer), new ForceApexClassCreateExecutor(), new postconditionCheckers_1.OverwriteComponentPrompt());
        yield commandlet.run();
    });
}
exports.forceApexClassCreate = forceApexClassCreate;
//# sourceMappingURL=forceApexClassCreate.js.map