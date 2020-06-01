import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { BaseTemplateCommand } from './baseTemplateCommand';
export declare class ForceApexClassCreateExecutor extends BaseTemplateCommand {
    constructor();
    build(data: DirFileNameSelection): Command;
}
export declare function forceApexClassCreate(): Promise<void>;
