import { ContinueResponse, DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { SfdxCommandletExecutor } from '../util';
import { SourcePathStrategy } from '../util';
export declare abstract class BaseTemplateCommand extends SfdxCommandletExecutor<DirFileNameSelection> {
    private metadataType;
    constructor(type: string);
    execute(response: ContinueResponse<DirFileNameSelection>): void;
    private identifyDirType;
    private getPathToSource;
    getSourcePathStrategy(): SourcePathStrategy;
    getFileExtension(): string;
    getDefaultDirectory(): string;
}
