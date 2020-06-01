import { TestExecutionInfo } from '../types';
/**
 * Start watching tests using the provided test execution info.
 * It will kick off a VS Code task to execute the test runner in watch mode,
 * so that on file changes to the test file or the code related to the test file,
 * it will re-run the tests.
 * @param data providded by test watch commands (or test explorer potentially in the future)
 */
export declare function forceLwcTestStartWatching(data: {
    testExecutionInfo: TestExecutionInfo;
}): Promise<void>;
export declare function forceLwcTestStopWatching(data: {
    testExecutionInfo: TestExecutionInfo;
}): Promise<void>;
/**
 * Start watching the test of currently focused editor
 */
export declare function forceLwcTestStartWatchingCurrentFile(): Promise<void>;
/**
 * Stop watching the test of currently focused editor
 */
export declare function forceLwcTestStopWatchingCurrentFile(): Promise<void> | undefined;
//# sourceMappingURL=forceLwcTestWatchAction.d.ts.map