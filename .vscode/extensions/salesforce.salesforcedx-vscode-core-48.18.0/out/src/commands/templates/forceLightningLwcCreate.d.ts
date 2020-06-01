import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { Uri } from 'vscode';
import { BaseTemplateCommand } from './baseTemplateCommand';
export declare class ForceLightningLwcCreateExecutor extends BaseTemplateCommand {
    constructor();
    build(data: DirFileNameSelection): Command;
}
export declare function forceLightningLwcCreate(): Promise<void>;
export declare function forceInternalLightningLwcCreate(sourceUri: Uri): Promise<void>;
