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
const settings_1 = require("../../settings");
const util_1 = require("../util");
const postconditionCheckers_1 = require("../util/postconditionCheckers");
const baseTemplateCommand_1 = require("./baseTemplateCommand");
const internalCommandUtils_1 = require("./internalCommandUtils");
const metadataTypeConstants_1 = require("./metadataTypeConstants");
class ForceLightningEventCreateExecutor extends baseTemplateCommand_1.BaseTemplateCommand {
    constructor() {
        super(metadataTypeConstants_1.AURA_TYPE);
    }
    build(data) {
        const builder = new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_lightning_event_create_text'))
            .withArg('force:lightning:event:create')
            .withFlag('--eventname', data.fileName)
            .withFlag('--outputdir', data.outputdir)
            .withLogName('force_lightning_event_create');
        if (settings_1.sfdxCoreSettings.getInternalDev()) {
            builder.withArg('--internal');
        }
        return builder.build();
    }
    getFileExtension() {
        return metadataTypeConstants_1.AURA_EVENT_EXTENSION;
    }
}
exports.ForceLightningEventCreateExecutor = ForceLightningEventCreateExecutor;
const fileNameGatherer = new util_1.SelectFileName();
const outputDirGatherer = new util_1.SelectOutputDir(metadataTypeConstants_1.AURA_DIRECTORY, true);
const metadataTypeGatherer = new util_1.MetadataTypeGatherer(metadataTypeConstants_1.AURA_TYPE);
function forceLightningEventCreate() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), new util_1.CompositeParametersGatherer(metadataTypeGatherer, fileNameGatherer, outputDirGatherer), new ForceLightningEventCreateExecutor(), new postconditionCheckers_1.OverwriteComponentPrompt());
        yield commandlet.run();
    });
}
exports.forceLightningEventCreate = forceLightningEventCreate;
function forceInternalLightningEventCreate(sourceUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_1.SfdxCommandlet(new internalCommandUtils_1.InternalDevWorkspaceChecker(), new util_1.CompositeParametersGatherer(fileNameGatherer, new internalCommandUtils_1.FileInternalPathGatherer(sourceUri)), new ForceLightningEventCreateExecutor());
        yield commandlet.run();
    });
}
exports.forceInternalLightningEventCreate = forceInternalLightningEventCreate;
//# sourceMappingURL=forceLightningEventCreate.js.map