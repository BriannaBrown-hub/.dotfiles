import TelemetryReporter from 'vscode-extension-telemetry';
export declare class TelemetryService {
    private static instance;
    private reporter;
    private isTelemetryEnabled;
    private setup;
    constructor();
    static getInstance(): TelemetryService;
    setupVSCodeTelemetry(): Promise<TelemetryService | undefined>;
    initializeService(reporter: TelemetryReporter, isTelemetryEnabled: boolean): void;
    sendExtensionActivationEvent(hrstart: [number, number]): Promise<void>;
    sendExtensionDeactivationEvent(): Promise<void>;
    sendCommandEvent(commandName?: string, hrstart?: [number, number], additionalData?: any): Promise<void>;
    sendException(name: string, message: string): Promise<void>;
    private getEndHRTime;
}
//# sourceMappingURL=telemetry.d.ts.map