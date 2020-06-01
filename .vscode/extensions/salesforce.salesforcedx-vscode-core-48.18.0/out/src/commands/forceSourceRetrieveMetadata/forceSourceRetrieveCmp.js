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
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const messages_1 = require("../../messages");
const util_1 = require("../util");
const parameterGatherers_1 = require("../util/parameterGatherers");
const postconditionCheckers_1 = require("../util/postconditionCheckers");
class ForceSourceRetrieveExecutor extends util_1.SfdxCommandletExecutor {
    constructor(describer) {
        super();
        this.describer = describer;
    }
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_source_retrieve_text'))
            .withLogName('force_source_retrieve')
            .withArg('force:source:retrieve')
            .withArg('-m')
            .withArg(this.describer.buildMetadataArg(data))
            .build();
    }
    getTelemetryData(success, response) {
        const quantities = this.getNumberOfRetrievedTypes(response.data);
        const rows = Object.keys(quantities).map(type => {
            return { type, quantity: quantities[type] };
        });
        return {
            properties: {
                metadataCount: JSON.stringify(rows)
            }
        };
    }
    getNumberOfRetrievedTypes(data) {
        const quantities = {};
        data.forEach(selection => {
            const current = quantities[selection.type];
            quantities[selection.type] = current ? current + 1 : 1;
        });
        return quantities;
    }
}
exports.ForceSourceRetrieveExecutor = ForceSourceRetrieveExecutor;
function forceSourceRetrieveCmp(trigger) {
    return __awaiter(this, void 0, void 0, function* () {
        const retrieveDescriber = trigger.describer();
        const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), new parameterGatherers_1.RetrieveComponentOutputGatherer(retrieveDescriber), new ForceSourceRetrieveExecutor(retrieveDescriber), new postconditionCheckers_1.OverwriteComponentPrompt());
        yield commandlet.run();
    });
}
exports.forceSourceRetrieveCmp = forceSourceRetrieveCmp;
//# sourceMappingURL=forceSourceRetrieveCmp.js.map