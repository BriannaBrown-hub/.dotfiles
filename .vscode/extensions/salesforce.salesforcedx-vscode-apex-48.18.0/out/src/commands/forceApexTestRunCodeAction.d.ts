import { Command, SfdxCommandBuilder } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
declare const SfdxCommandletExecutor: any;
export declare class ForceApexTestRunCodeActionExecutor extends SfdxCommandletExecutor<{}> {
    protected test: string;
    protected shouldGetCodeCoverage: boolean;
    protected builder: SfdxCommandBuilder;
    private outputToJson;
    constructor(test: string, shouldGetCodeCoverage: boolean, outputToJson: string);
    build(data: {}): Command;
}
export declare function forceApexTestClassRunCodeActionDelegate(testClass: string): Promise<void>;
export declare function resolveTestClassParam(testClass: string): Promise<string>;
export declare function forceApexTestClassRunCodeAction(testClass: string): Promise<void>;
export declare function forceApexTestMethodRunCodeActionDelegate(testMethod: string): Promise<void>;
export declare function resolveTestMethodParam(testMethod: string): Promise<string>;
export declare function forceApexTestMethodRunCodeAction(testMethod: string): Promise<void>;
export {};
