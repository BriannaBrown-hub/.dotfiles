"use strict";
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const waitForDX_1 = require("../dxsupport/waitForDX");
const EXTENSION_NAME = 'salesforcedx-vscode-lightning';
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
    setupVSCodeTelemetry() {
        return __awaiter(this, void 0, void 0, function* () {
            const telemetryService = TelemetryService.getInstance();
            // if its already set up
            if (this.reporter) {
                return Promise.resolve(telemetryService);
            }
            if (!this.setup) {
                this.setup = waitForDX_1.waitForDX(true)
                    .then((coreDependency) => {
                    coreDependency.exports.telemetryService.showTelemetryMessage();
                    telemetryService.initializeService(coreDependency.exports.telemetryService.getReporter(), coreDependency.exports.telemetryService.isTelemetryEnabled());
                    return telemetryService;
                })
                    .catch(err => {
                    return undefined;
                });
            }
            return this.setup;
        });
    }
    initializeService(reporter, isTelemetryEnabled) {
        this.isTelemetryEnabled = isTelemetryEnabled;
        this.reporter = reporter;
    }
    sendExtensionActivationEvent(hrstart) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupVSCodeTelemetry();
            if (this.reporter !== undefined && this.isTelemetryEnabled) {
                const startupTime = this.getEndHRTime(hrstart);
                this.reporter.sendTelemetryEvent('activationEvent', {
                    extensionName: EXTENSION_NAME,
                    startupTime
                });
            }
        });
    }
    sendExtensionDeactivationEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupVSCodeTelemetry();
            if (this.reporter !== undefined && this.isTelemetryEnabled) {
                this.reporter.sendTelemetryEvent('deactivationEvent', {
                    extensionName: EXTENSION_NAME
                });
            }
        });
    }
    sendCommandEvent(commandName, hrstart, additionalData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupVSCodeTelemetry();
            if (this.reporter !== undefined && this.isTelemetryEnabled && commandName) {
                const baseTelemetry = Object.assign({ extensionName: EXTENSION_NAME, commandName }, (hrstart && { executionTime: this.getEndHRTime(hrstart) }));
                const aggregatedTelemetry = Object.assign(baseTelemetry, additionalData);
                this.reporter.sendTelemetryEvent('commandExecution', aggregatedTelemetry);
            }
        });
    }
    sendException(name, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupVSCodeTelemetry();
            if (this.reporter !== undefined && this.isTelemetryEnabled) {
                // @ts-ignore
                this.reporter.sendExceptionEvent(name, message);
            }
        });
    }
    getEndHRTime(hrstart) {
        const hrend = process.hrtime(hrstart);
        return util.format('%d%d', hrend[0], hrend[1] / 1000000);
    }
}
exports.TelemetryService = TelemetryService;
//# sourceMappingURL=telemetry.js.map