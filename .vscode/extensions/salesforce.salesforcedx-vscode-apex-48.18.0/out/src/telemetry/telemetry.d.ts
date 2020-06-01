import TelemetryReporter from 'vscode-extension-telemetry';
export declare class TelemetryService {
    private static instance;
    private reporter;
    private isTelemetryEnabled;
    constructor();
    static getInstance(): TelemetryService;
    initializeService(reporter: TelemetryReporter, isTelemetryEnabled: boolean): void;
    sendExtensionActivationEvent(hrstart: [number, number]): void;
    sendExtensionDeactivationEvent(): void;
    sendApexLSPActivationEvent(hrstart: [number, number]): void;
    sendApexLSPError(errorMsg: string): void;
    sendApexLSPLog(properties?: {
        [key: string]: string;
    }, measures?: {
        [key: string]: number;
    }): void;
    sendErrorEvent(error: {
        message: string;
        stack?: string;
    }, additionalData?: any): void;
    getEndHRTime(hrstart: [number, number]): string;
}
