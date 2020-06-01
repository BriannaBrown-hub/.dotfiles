import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { CancelResponse, ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import * as vscode from 'vscode';
import { CommandExecution } from '../../../salesforcedx-utils-vscode/out/src/cli/commandExecutor';
import { SfdxCommandletExecutor } from './util';
export declare class ForceApexLogGetExecutor extends SfdxCommandletExecutor<ApexDebugLogIdStartTime> {
    build(data: ApexDebugLogIdStartTime): Command;
    protected attachExecution(execution: CommandExecution, cancellationTokenSource: vscode.CancellationTokenSource, cancellationToken: vscode.CancellationToken): void;
    execute(response: ContinueResponse<ApexDebugLogIdStartTime>): Promise<void>;
}
export declare type ApexDebugLogIdStartTime = {
    id: string;
    startTime: string;
};
export declare type ApexDebugLogUser = {
    Name: string;
};
export declare type ApexDebugLogObject = {
    Id: string;
    StartTime: string;
    LogLength: number;
    Operation: string;
    Request: string;
    Status: string;
    LogUser: ApexDebugLogUser;
};
export declare class LogFileSelector implements ParametersGatherer<ApexDebugLogIdStartTime> {
    gather(): Promise<CancelResponse | ContinueResponse<ApexDebugLogIdStartTime>>;
}
export declare class ForceApexLogList {
    static getLogs(cancellationTokenSource: vscode.CancellationTokenSource): Promise<ApexDebugLogObject[]>;
}
export declare function forceApexLogGet(explorerDir?: any): Promise<void>;
