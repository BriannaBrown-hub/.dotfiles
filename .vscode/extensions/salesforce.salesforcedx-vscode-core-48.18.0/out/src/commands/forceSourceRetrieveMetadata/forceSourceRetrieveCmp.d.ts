import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse, LocalComponent } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { RetrieveDescriber, RetrieveMetadataTrigger } from '.';
import { TelemetryData } from '../../telemetry';
import { SfdxCommandletExecutor } from '../util';
export declare class ForceSourceRetrieveExecutor extends SfdxCommandletExecutor<LocalComponent[]> {
    private describer;
    constructor(describer: RetrieveDescriber);
    build(data?: LocalComponent[]): Command;
    protected getTelemetryData(success: boolean, response: ContinueResponse<LocalComponent[]>): TelemetryData;
    private getNumberOfRetrievedTypes;
}
export declare function forceSourceRetrieveCmp(trigger: RetrieveMetadataTrigger): Promise<void>;
