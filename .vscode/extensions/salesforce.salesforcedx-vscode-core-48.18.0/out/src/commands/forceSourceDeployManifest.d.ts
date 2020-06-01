import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import * as vscode from 'vscode';
import { BaseDeployExecutor, DeployType } from './baseDeployCommand';
export declare class ForceSourceDeployManifestExecutor extends BaseDeployExecutor {
    build(manifestPath: string): Command;
    protected getDeployType(): DeployType;
}
export declare function forceSourceDeployManifest(manifestUri: vscode.Uri): Promise<void>;
