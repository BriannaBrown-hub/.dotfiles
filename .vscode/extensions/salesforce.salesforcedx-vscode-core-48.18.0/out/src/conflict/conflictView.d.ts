import { ExtensionContext, TreeView } from 'vscode';
import { ConflictFile, ConflictNode } from './conflictNode';
import { ConflictOutlineProvider } from './conflictOutlineProvider';
import { DirectoryDiffResults } from './directoryDiffer';
export declare class ConflictView {
    private static VIEW_ID;
    private static instance;
    private _treeView?;
    private _dataProvider?;
    private constructor();
    static getInstance(): ConflictView;
    readonly treeView: TreeView<ConflictNode>;
    readonly dataProvider: ConflictOutlineProvider;
    visualizeDifferences(title: string, remoteLabel: string, reveal: boolean, diffResults?: DirectoryDiffResults): void;
    createConflictEntries(diffResults: DirectoryDiffResults, remoteLabel: string): ConflictFile[];
    init(extensionContext: ExtensionContext): Promise<void>;
    private updateEnablementMessage;
    private revealConflictNode;
    private initError;
}
