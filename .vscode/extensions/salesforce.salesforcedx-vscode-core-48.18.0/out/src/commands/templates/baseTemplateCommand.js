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
const path = require("path");
const vscode = require("vscode");
const channels_1 = require("../../channels");
const notifications_1 = require("../../notifications");
const statuses_1 = require("../../statuses");
const util_1 = require("../../util");
const metadataDictionary_1 = require("../../util/metadataDictionary");
const util_2 = require("../util");
class BaseTemplateCommand extends util_2.SfdxCommandletExecutor {
    constructor(type) {
        super();
        const info = metadataDictionary_1.MetadataDictionary.getInfo(type);
        if (!info) {
            throw new Error(`Unrecognized metadata type ${type}`);
        }
        this.metadataType = info;
    }
    execute(response) {
        const startTime = process.hrtime();
        const cancellationTokenSource = new vscode.CancellationTokenSource();
        const cancellationToken = cancellationTokenSource.token;
        const execution = new cli_1.CliCommandExecutor(this.build(response.data), {
            cwd: util_1.getRootWorkspacePath()
        }).execute(cancellationToken);
        execution.processExitSubject.subscribe((data) => __awaiter(this, void 0, void 0, function* () {
            this.logMetric(execution.command.logName, startTime, {
                dirType: this.identifyDirType(response.data.outputdir)
            });
            if (data !== undefined && data.toString() === '0' && util_1.hasRootWorkspace()) {
                const document = yield vscode.workspace.openTextDocument(this.getPathToSource(response.data.outputdir, response.data.fileName));
                vscode.window.showTextDocument(document);
            }
        }));
        notifications_1.notificationService.reportExecutionError(execution.command.toString(), execution.stderrSubject);
        channels_1.channelService.streamCommandOutput(execution);
        notifications_1.ProgressNotification.show(execution, cancellationTokenSource);
        statuses_1.taskViewService.addCommandExecution(execution, cancellationTokenSource);
    }
    identifyDirType(outputDirectory) {
        const defaultDirectoryPath = path.join(util_2.SelectOutputDir.defaultOutput, this.getDefaultDirectory());
        return outputDirectory.endsWith(defaultDirectoryPath)
            ? 'defaultDir'
            : 'customDir';
    }
    getPathToSource(outputDir, fileName) {
        const sourceDirectory = path.join(util_1.getRootWorkspacePath(), outputDir);
        return this.getSourcePathStrategy().getPathToSource(sourceDirectory, fileName, this.getFileExtension());
    }
    getSourcePathStrategy() {
        return this.metadataType.pathStrategy;
    }
    getFileExtension() {
        return `.${this.metadataType.suffix}`;
    }
    getDefaultDirectory() {
        return this.metadataType.directory;
    }
}
exports.BaseTemplateCommand = BaseTemplateCommand;
//# sourceMappingURL=baseTemplateCommand.js.map