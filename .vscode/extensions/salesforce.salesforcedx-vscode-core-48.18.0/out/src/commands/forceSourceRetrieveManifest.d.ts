import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import * as vscode from 'vscode';
import { SfdxCommandletExecutor } from './util';
export declare class ForceSourceRetrieveManifestExecutor extends SfdxCommandletExecutor<string> {
    build(manifestPath: string): Command;
}
export declare function forceSourceRetrieveManifest(explorerPath: vscode.Uri): Promise<void>;
