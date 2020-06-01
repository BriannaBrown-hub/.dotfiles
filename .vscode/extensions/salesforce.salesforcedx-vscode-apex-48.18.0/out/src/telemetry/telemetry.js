"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const util = require("util");
const EXTENSION_NAME = 'salesforcedx-vscode-apex';
class TelemetryService {
    constructor() {
        this.isTelemetryEnabled = false;
    }
    static getInstance() {
        if (!TelemetryService.instance) {
            TelemetryService.instance = new TelemetryService();
        }
        return TelemetryService.instance;
    }
    initializeService(reporter, isTelemetryEnabled) {
        this.isTelemetryEnabled = isTelemetryEnabled;
        this.reporter = reporter;
    }
    sendExtensionActivationEvent(hrstart) {
        if (this.reporter !== undefined && this.isTelemetryEnabled) {
            const startupTime = this.getEndHRTime(hrstart);
            this.reporter.sendTelemetryEvent('activationEvent', {
                extensionName: EXTENSION_NAME,
                startupTime
            });
        }
    }
    sendExtensionDeactivationEvent() {
        if (this.reporter !== undefined && this.isTelemetryEnabled) {
            this.reporter.sendTelemetryEvent('deactivationEvent', {
                extensionName: EXTENSION_NAME
            });
        }
    }
    sendApexLSPActivationEvent(hrstart) {
        if (this.reporter !== undefined && this.isTelemetryEnabled) {
            const startupTime = this.getEndHRTime(hrstart);
            this.reporter.sendTelemetryEvent('apexLSPStartup', {
                extensionName: EXTENSION_NAME,
                startupTime
            });
        }
    }
    sendApexLSPError(errorMsg) {
        if (this.reporter !== undefined && this.isTelemetryEnabled) {
            this.reporter.sendTelemetryEvent('apexLSPError', {
                extensionName: EXTENSION_NAME,
                errorMsg
            });
        }
    }
    sendApexLSPLog(properties, measures) {
        if (this.reporter !== undefined && this.isTelemetryEnabled) {
            this.reporter.sendTelemetryEvent('apexLSPLog', properties, measures);
        }
    }
    sendErrorEvent(error, additionalData) {
        if (this.reporter !== undefined && this.isTelemetryEnabled) {
            const baseTelemetry = {
                extensionName: EXTENSION_NAME,
                errorMessage: error.message,
                errorStack: error.stack
            };
            const aggregatedTelemetry = Object.assign(baseTelemetry, additionalData);
            this.reporter.sendTelemetryEvent('error', aggregatedTelemetry);
        }
    }
    getEndHRTime(hrstart) {
        const hrend = process.hrtime(hrstart);
        return util.format('%d%d', hrend[0], hrend[1] / 1000000);
    }
}
exports.TelemetryService = TelemetryService;
//# sourceMappingURL=telemetry.js.map