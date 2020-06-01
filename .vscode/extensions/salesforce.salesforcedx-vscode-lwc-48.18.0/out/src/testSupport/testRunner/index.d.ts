import * as vscode from 'vscode';
import { TestRunner, TestRunType } from './testRunner';
/**
 * Get the absolute path to LWC Test runner executable, installed in an SFDX project.
 * @param sfdxProjectPath path to the root directory of an SFDX Project
 * @returns path to lwc test runner
 */
export declare function getLwcTestRunnerExecutable(sfdxProjectPath: string): string | undefined;
/**
 * If testUri is specified, returns the workspace folder containing the test if it exists.
 * Otherwise, return the first workspace folder if it exists.
 * @param testUri optional testUri
 */
export declare function getTestWorkspaceFolder(testUri?: vscode.Uri): vscode.WorkspaceFolder | undefined;
export { TestRunner, TestRunType };
//# sourceMappingURL=index.d.ts.map