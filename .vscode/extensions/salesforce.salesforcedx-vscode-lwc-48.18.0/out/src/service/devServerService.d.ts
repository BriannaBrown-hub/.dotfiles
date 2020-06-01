export interface ServerHandler {
    stop(): Promise<void>;
}
export declare class DevServerService {
    private static _instance;
    static readonly instance: DevServerService;
    private handlers;
    isServerHandlerRegistered(): boolean;
    registerServerHandler(handler: ServerHandler): void;
    clearServerHandler(handler: ServerHandler): void;
    getServerHandlers(): ServerHandler[];
    stopServer(): Promise<void>;
}
//# sourceMappingURL=devServerService.d.ts.map