import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import * as vscode from 'vscode';
import { BaseDeployExecutor, DeployType } from './baseDeployCommand';
import { LibraryCommandletExecutor } from './util/libraryCommandlet';
export declare class ForceSourceDeploySourcePathExecutor extends BaseDeployExecutor {
    build(sourcePath: string): Command;
    protected getDeployType(): DeployType;
}
export declare class MultipleSourcePathsGatherer implements ParametersGatherer<string> {
    private uris;
    constructor(uris: vscode.Uri[]);
    gather(): Promise<ContinueResponse<string>>;
}
export declare function forceSourceDeploySourcePath(sourceUri: vscode.Uri): Promise<void>;
export declare function forceSourceDeployMultipleSourcePaths(uris: vscode.Uri[]): Promise<void>;
export declare function useBetaRetrieve(explorerPath: vscode.Uri[]): boolean;
export declare class LibraryDeploySourcePathExecutor extends LibraryCommandletExecutor<string> {
    execute(response: ContinueResponse<string>): Promise<void>;
}
