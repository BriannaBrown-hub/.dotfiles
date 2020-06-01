"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const messages_1 = require("../messages");
exports.DEFAULT_SFDX_CHANNEL = vscode.window.createOutputChannel(messages_1.nls.localize('channel_name'));
class ChannelService {
    constructor(channel) {
        this.channel = channel || exports.DEFAULT_SFDX_CHANNEL;
    }
    static getInstance(channel) {
        if (!ChannelService.instance) {
            ChannelService.instance = new ChannelService(channel);
        }
        return ChannelService.instance;
    }
    streamCommandOutput(execution) {
        this.streamCommandStartStop(execution);
        execution.stderrSubject.subscribe(data => this.channel.append(data.toString()));
        execution.stdoutSubject.subscribe(data => this.channel.append(data.toString()));
    }
    streamCommandStartStop(execution) {
        this.channel.append(messages_1.nls.localize('channel_starting_message'));
        this.channel.appendLine(execution.command.toString());
        this.channel.appendLine('');
        this.showCommandWithTimestamp(execution.command.toCommand());
        execution.processExitSubject.subscribe(data => {
            this.showCommandWithTimestamp(execution.command.toCommand());
            this.channel.append(' ');
            if (data !== undefined && data !== null) {
                this.channel.appendLine(messages_1.nls.localize('channel_end_with_exit_code', data.toString()));
            }
            else {
                this.channel.appendLine(messages_1.nls.localize('channel_end'));
            }
            this.channel.appendLine('');
        });
        execution.processErrorSubject.subscribe(data => {
            this.showCommandWithTimestamp(execution.command.toCommand());
            this.channel.append(' ');
            if (data !== undefined) {
                this.channel.appendLine(messages_1.nls.localize('channel_end_with_error', data.message));
                if (/sfdx.*ENOENT/.test(data.message)) {
                    this.channel.appendLine(messages_1.nls.localize('channel_end_with_sfdx_not_found'));
                }
            }
            else {
                this.channel.appendLine(messages_1.nls.localize('channel_end'));
            }
            this.channel.appendLine('');
        });
    }
    showCommandWithTimestamp(commandName) {
        this.channel.appendLine(this.getExecutionTime() + ' ' + commandName);
    }
    getExecutionTime() {
        const d = new Date();
        const hr = this.ensureDoubleDigits(d.getHours());
        const mins = this.ensureDoubleDigits(d.getMinutes());
        const sec = this.ensureDoubleDigits(d.getSeconds());
        const milli = d.getMilliseconds();
        return `${hr}:${mins}:${sec}.${milli}`;
    }
    ensureDoubleDigits(num) {
        return num < 10 ? `0${num.toString()}` : num.toString();
    }
    showChannelOutput() {
        this.channel.show(true);
    }
    appendLine(text) {
        this.channel.appendLine(text);
    }
}
exports.ChannelService = ChannelService;
//# sourceMappingURL=channelService.js.map