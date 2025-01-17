import * as vscode from 'vscode';
import { RetrieveDescriber, RetrieveMetadataTrigger } from '../commands/forceSourceRetrieveMetadata';
import { MetadataObject } from './metadataType';
export declare enum NodeType {
    Org = "org",
    MetadataType = "type",
    MetadataCmp = "component",
    EmptyNode = "empty",
    Folder = "folder"
}
export declare class BrowserNode extends vscode.TreeItem implements RetrieveMetadataTrigger {
    readonly type: NodeType;
    toRefresh: boolean;
    readonly fullName: string;
    suffix?: string;
    directoryName?: string;
    metadataObject?: MetadataObject;
    private _children;
    private _parent;
    constructor(label: string, type: NodeType, fullName?: string, metadataObject?: MetadataObject);
    setComponents(fullNames: string[], type: NodeType): void;
    setTypes(metadataObjects: MetadataObject[], type: NodeType): void;
    readonly parent: BrowserNode | undefined;
    readonly children: BrowserNode[] | undefined;
    getAssociatedTypeNode(): BrowserNode;
    describer(): RetrieveDescriber;
}
