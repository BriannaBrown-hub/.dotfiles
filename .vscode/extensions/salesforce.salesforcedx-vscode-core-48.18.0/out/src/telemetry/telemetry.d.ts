import TelemetryReporter from './telemetryReporter';
import vscode = require('vscode');
export interface TelemetryData {
    properties?: {
        [key: string]: string;
    };
    measurements?: {
        [key: string]: number;
    };
}
export declare class TelemetryService {
    private static instance;
    private context;
    private reporter;
    private cliAllowsTelemetry;
    static getInstance(): TelemetryService;
    initializeService(context: vscode.ExtensionContext, machineId: string): Promise<void>;
    getReporter(): TelemetryReporter | undefined;
    isTelemetryEnabled(): boolean;
    private getHasTelemetryMessageBeenShown;
    private setTelemetryMessageShowed;
    showTelemetryMessage(): void;
    sendExtensionActivationEvent(hrstart: [number, number]): void;
    sendExtensionDeactivationEvent(): void;
    sendCommandEvent(commandName?: string, hrstart?: [number, number], additionalData?: any): void;
    sendException(name: string, message: string): void;
    sendEventData(eventName: string, properties?: {
        [key: string]: string;
    }, measures?: {
        [key: string]: number;
    }): void;
    dispose(): void;
    getEndHRTime(hrstart: [number, number]): string;
    checkCliTelemetry(): Promise<boolean>;
    setCliTelemetryEnabled(isEnabled: boolean): void;
}
