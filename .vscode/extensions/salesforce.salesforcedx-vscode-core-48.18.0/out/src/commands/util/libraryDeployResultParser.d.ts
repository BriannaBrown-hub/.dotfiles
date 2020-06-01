import { DeployResult, SourceResult } from '@salesforce/source-deploy-retrieve';
export declare class LibraryDeployResultParser {
    result: DeployResult;
    constructor(deployResult: DeployResult);
    buildSuccesses(componentSuccess: SourceResult): {
        state: string;
        fullName: string | undefined;
        type: string;
        filePath: string | undefined;
    }[];
    buildErrors(componentErrors: SourceResult[]): {
        filePath: string | undefined;
        error: string | undefined;
    }[];
    outputResult(sourceUri?: string): Promise<string>;
}
