"use strict";
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const output_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/output");
const messages_1 = require("../../messages");
const telemetry_1 = require("../../telemetry");
function outputRetrieveTable(retrieveResult) {
    if (retrieveResult.components.length === 0) {
        return retrieveResult.message
            ? retrieveResult.message
            : messages_1.nls.localize('lib_retrieve_result_parse_error', JSON.stringify(retrieveResult));
    }
    let outputResult;
    const table = new output_1.Table();
    const title = messages_1.nls.localize('lib_retrieve_result_title');
    const resultRows = [];
    try {
        retrieveResult.components.forEach(item => {
            // rows for source files
            item.sources.forEach(sourceItem => {
                resultRows.push({
                    fullName: item.fullName,
                    type: item.type.name,
                    filePath: sourceItem
                });
            });
            // row for xml
            resultRows.push({
                fullName: item.fullName,
                type: item.type.name,
                filePath: item.xml
            });
        });
        outputResult = table.createTable(resultRows, [
            { key: 'fullName', label: messages_1.nls.localize('table_header_full_name') },
            { key: 'type', label: messages_1.nls.localize('table_header_type') },
            {
                key: 'filePath',
                label: messages_1.nls.localize('table_header_project_path')
            }
        ], title);
    }
    catch (e) {
        telemetry_1.telemetryService.sendException('force_source_retrieve_with_sourcepath_beta_result_format', e.message);
        outputResult = messages_1.nls.localize('lib_retrieve_result_parse_error', JSON.stringify(retrieveResult));
    }
    return outputResult;
}
exports.outputRetrieveTable = outputRetrieveTable;
//# sourceMappingURL=retrieveParser.js.map