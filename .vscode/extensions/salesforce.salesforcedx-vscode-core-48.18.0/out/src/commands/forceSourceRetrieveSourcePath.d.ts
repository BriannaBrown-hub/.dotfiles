import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { PostconditionChecker } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { CancelResponse, ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types/index';
import * as vscode from 'vscode';
import { SfdxCommandletExecutor } from './util';
import { LibraryCommandletExecutor } from './util/libraryCommandlet';
export declare class ForceSourceRetrieveSourcePathExecutor extends SfdxCommandletExecutor<string> {
    build(sourcePath: string): Command;
}
export declare class SourcePathChecker implements PostconditionChecker<string> {
    check(inputs: ContinueResponse<string> | CancelResponse): Promise<ContinueResponse<string> | CancelResponse>;
}
export declare function forceSourceRetrieveSourcePath(explorerPath: vscode.Uri): Promise<void>;
export declare function useBetaRetrieve(explorerPath: vscode.Uri): boolean;
export declare class LibraryRetrieveSourcePathExecutor extends LibraryCommandletExecutor<string> {
    execute(response: ContinueResponse<string>): Promise<void>;
}
