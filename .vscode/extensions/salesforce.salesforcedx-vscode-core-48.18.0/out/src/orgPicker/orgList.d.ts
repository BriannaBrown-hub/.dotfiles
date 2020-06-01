import { CancelResponse, ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import * as vscode from 'vscode';
export interface FileInfo {
    scratchAdminUsername?: string;
    isDevHub?: boolean;
    username: string;
    devHubUsername?: string;
}
export declare class OrgList implements vscode.Disposable {
    private statusBarItem;
    constructor();
    displayDefaultUsername(defaultUsernameorAlias?: string): void;
    getAuthInfoObjects(): Promise<FileInfo[] | null>;
    filterAuthInfo(authInfoObjects: FileInfo[]): Promise<string[]>;
    updateOrgList(): Promise<string[] | null>;
    setDefaultOrg(): Promise<CancelResponse | ContinueResponse<{}>>;
    getDefaultDevHubUsernameorAlias(): Promise<string | undefined>;
    dispose(): void;
    onSfdxConfigEvent(): Promise<void>;
    registerDefaultUsernameWatcher(context: vscode.ExtensionContext): void;
}
