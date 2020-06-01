import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { BaseTemplateCommand } from './baseTemplateCommand';
export declare class ForceVisualForceComponentCreateExecutor extends BaseTemplateCommand {
    constructor();
    build(data: DirFileNameSelection): Command;
}
export declare function forceVisualforceComponentCreate(): Promise<void>;
