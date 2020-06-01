import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { ApiResult, DeployResult, SourceClient } from '@salesforce/source-deploy-retrieve';
import { TelemetryData } from '../../telemetry';
import { CommandletExecutor } from './sfdxCommandlet';
export declare abstract class LibraryCommandletExecutor<T> implements CommandletExecutor<T> {
    static errorCollection: import("vscode").DiagnosticCollection;
    protected showChannelOutput: boolean;
    protected sourceClient: SourceClient | undefined;
    protected executionName: string;
    protected startTime: [number, number] | undefined;
    protected telemetryName: string | undefined;
    execute(response: ContinueResponse<T>): void;
    build(execName: string, telemetryLogName: string): Promise<void>;
    retrieveWrapper(fn: (...args: any[]) => Promise<ApiResult>): (...args: any[]) => Promise<ApiResult>;
    deployWrapper(fn: (...args: any[]) => Promise<DeployResult>): (...args: any[]) => Promise<DeployResult>;
    logMetric(): void;
    setStartTime(): void;
    protected getTelemetryData(success: boolean, response: ContinueResponse<T>, output: string): TelemetryData | undefined;
}
