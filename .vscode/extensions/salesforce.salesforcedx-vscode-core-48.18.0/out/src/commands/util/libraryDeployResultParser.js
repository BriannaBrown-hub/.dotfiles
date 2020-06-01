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
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const output_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/output");
const source_deploy_retrieve_1 = require("@salesforce/source-deploy-retrieve");
const messages_1 = require("../../messages");
class LibraryDeployResultParser {
    constructor(deployResult) {
        this.result = deployResult;
    }
    buildSuccesses(componentSuccess) {
        const mdState = componentSuccess.changed && !componentSuccess.created
            ? 'Updated'
            : 'Created';
        const success = [
            {
                state: mdState,
                fullName: componentSuccess.fullName,
                type: componentSuccess.componentType,
                filePath: componentSuccess.fileName
            },
            {
                state: mdState,
                fullName: componentSuccess.fullName,
                type: componentSuccess.componentType,
                filePath: `${componentSuccess.fileName}-meta.xml`
            }
        ];
        return success;
    }
    buildErrors(componentErrors) {
        const failures = [];
        for (const err of componentErrors) {
            if (err.columnNumber && err.lineNumber) {
                err.problem = `${err.problem} (${err.lineNumber}:${err.columnNumber})`;
            }
            failures.push({
                filePath: err.fileName,
                error: err.problem
            });
        }
        return failures;
    }
    outputResult(sourceUri) {
        return __awaiter(this, void 0, void 0, function* () {
            let outputResult;
            const table = new output_1.Table();
            let title;
            switch (this.result.State) {
                case source_deploy_retrieve_1.DeployStatusEnum.Completed:
                    title = messages_1.nls.localize(`table_title_deployed_source`);
                    const successRows = this.buildSuccesses(this.result.DeployDetails.componentSuccesses[0]);
                    outputResult = table.createTable(successRows, [
                        { key: 'state', label: messages_1.nls.localize('table_header_state') },
                        { key: 'fullName', label: messages_1.nls.localize('table_header_full_name') },
                        { key: 'type', label: messages_1.nls.localize('table_header_type') },
                        {
                            key: 'filePath',
                            label: messages_1.nls.localize('table_header_project_path')
                        }
                    ], title);
                    break;
                case source_deploy_retrieve_1.DeployStatusEnum.Failed:
                    const failedErrorRows = this.buildErrors(this.result.DeployDetails.componentFailures);
                    outputResult = table.createTable(failedErrorRows, [
                        {
                            key: 'filePath',
                            label: messages_1.nls.localize('table_header_project_path')
                        },
                        { key: 'error', label: messages_1.nls.localize('table_header_errors') }
                    ], messages_1.nls.localize(`table_title_deploy_errors`));
                    break;
                case source_deploy_retrieve_1.DeployStatusEnum.Queued:
                    outputResult = messages_1.nls.localize('beta_tapi_queue_status');
                    break;
                case source_deploy_retrieve_1.DeployStatusEnum.Error:
                    const error = this.result.ErrorMsg;
                    const errorRows = [{ filePath: sourceUri, error }];
                    outputResult = table.createTable(errorRows, [
                        {
                            key: 'filePath',
                            label: messages_1.nls.localize('table_header_project_path')
                        },
                        { key: 'error', label: messages_1.nls.localize('table_header_errors') }
                    ], messages_1.nls.localize(`table_title_deploy_errors`));
                    break;
                default:
                    outputResult = '';
            }
            return outputResult;
        });
    }
}
exports.LibraryDeployResultParser = LibraryDeployResultParser;
//# sourceMappingURL=libraryDeployResultParser.js.map