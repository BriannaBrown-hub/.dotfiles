import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { Uri } from 'vscode';
import { BaseTemplateCommand } from './baseTemplateCommand';
export declare class ForceLightningEventCreateExecutor extends BaseTemplateCommand {
    constructor();
    build(data: DirFileNameSelection): Command;
    getFileExtension(): string;
}
export declare function forceLightningEventCreate(): Promise<void>;
export declare function forceInternalLightningEventCreate(sourceUri: Uri): Promise<void>;
