import * as vscode from 'vscode';
import { CommandExecution } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
export declare const DEFAULT_SFDX_CHANNEL: vscode.OutputChannel;
export declare class ChannelService {
    private readonly channel;
    private static instance;
    constructor(channel?: vscode.OutputChannel);
    static getInstance(channel?: vscode.OutputChannel): ChannelService;
    streamCommandOutput(execution: CommandExecution): void;
    streamCommandStartStop(execution: CommandExecution): void;
    showCommandWithTimestamp(commandName: string): void;
    private getExecutionTime;
    private ensureDoubleDigits;
    showChannelOutput(): void;
    appendLine(text: string): void;
}
