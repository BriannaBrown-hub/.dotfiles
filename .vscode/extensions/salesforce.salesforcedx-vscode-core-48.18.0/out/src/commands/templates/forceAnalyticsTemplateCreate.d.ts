import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { CancelResponse, ContinueResponse, DirFileNameSelection, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { SourcePathStrategy } from '../util';
import { BaseTemplateCommand } from './baseTemplateCommand';
export declare class ForceAnalyticsTemplateCreateExecutor extends BaseTemplateCommand {
    constructor();
    getFileExtension(): string;
    build(data: TemplateAndDir): Command;
    sourcePathStrategy: SourcePathStrategy;
    getDefaultDirectory(): string;
}
export declare type TemplateAndDir = DirFileNameSelection & Template;
export interface Template {
    fileName: string;
}
export declare class SelectProjectTemplate implements ParametersGatherer<Template> {
    gather(): Promise<CancelResponse | ContinueResponse<Template>>;
}
export declare function forceAnalyticsTemplateCreate(): Promise<void>;
