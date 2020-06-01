import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
declare const ReadableApexTestRunExecutor_base: new (test: string, shouldGetCodeCoverage: boolean) => any;
export declare class ReadableApexTestRunExecutor extends ReadableApexTestRunExecutor_base {
    private outputToJson;
    constructor(tests: string[], shouldGetCodeCoverage: boolean, outputToJson: string);
    build(data: {}): Command;
    execute(response: ContinueResponse<{}>): void;
}
export {};
