"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const vscode = require("vscode");
const commands_1 = require("../commands");
const messages_1 = require("../messages");
class ReadableApexTestRunExecutor extends commands_1.ForceApexTestRunCodeActionExecutor {
    constructor(tests, shouldGetCodeCoverage, outputToJson) {
        super(tests.join(','), shouldGetCodeCoverage);
        this.outputToJson = outputToJson;
    }
    build(data) {
        this.builder = this.builder
            .withDescription(messages_1.nls.localize('force_apex_test_run_description_text'))
            .withArg('force:apex:test:run')
            .withFlag('--tests', this.test)
            .withFlag('--resultformat', 'human')
            .withFlag('--outputdir', this.outputToJson)
            .withFlag('--loglevel', 'error');
        if (this.shouldGetCodeCoverage) {
            this.builder = this.builder.withArg('--codecoverage');
        }
        return this.builder.build();
    }
    execute(response) {
        const cancellationTokenSource = new vscode.CancellationTokenSource();
        const cancellationToken = cancellationTokenSource.token;
        const execution = new cli_1.CliCommandExecutor(this.build(response.data), {
            cwd: vscode.workspace.workspaceFolders[0].uri.fsPath
        }).execute(cancellationToken);
        super.attachExecution(execution, cancellationTokenSource, cancellationToken);
    }
}
exports.ReadableApexTestRunExecutor = ReadableApexTestRunExecutor;
//# sourceMappingURL=readableApexTestRunExecutor.js.map