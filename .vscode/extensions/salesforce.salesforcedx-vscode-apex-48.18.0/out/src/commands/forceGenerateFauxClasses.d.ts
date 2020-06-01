import { SObjectCategory } from '@salesforce/salesforcedx-sobjects-faux-generator/out/src/describe';
import { SObjectRefreshSource } from '@salesforce/salesforcedx-sobjects-faux-generator/out/src/generator';
import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { CancelResponse, ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
declare const SfdxCommandletExecutor: any;
export declare type RefreshSelection = {
    category: SObjectCategory;
    source: SObjectRefreshSource;
};
export declare class SObjectRefreshGatherer implements ParametersGatherer<RefreshSelection> {
    private source?;
    constructor(source?: SObjectRefreshSource);
    gather(): Promise<ContinueResponse<RefreshSelection> | CancelResponse>;
}
export declare class ForceGenerateFauxClassesExecutor extends SfdxCommandletExecutor<{}> {
    private static isActive;
    build(data: {}): Command;
    execute(response: ContinueResponse<RefreshSelection>): Promise<void>;
}
export declare function forceGenerateFauxClassesCreate(source?: SObjectRefreshSource): Promise<void>;
export declare function initSObjectDefinitions(projectPath: string): Promise<void>;
export {};
