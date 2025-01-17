"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const vscode = require("vscode");
let wait;
function waitForDX(activate = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!wait) {
            wait = new Promise((resolve, reject) => {
                // 120 seconds from now
                const expires = new Date().getTime() + 1000 * 120;
                const dosetup = () => {
                    let success = false;
                    try {
                        const coreDependency = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core');
                        if (coreDependency && !coreDependency.isActive && activate) {
                            return coreDependency.activate().then(api => {
                                resolve(vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core'));
                            });
                        }
                        if (coreDependency && coreDependency.exports) {
                            success = true;
                            resolve(coreDependency);
                        }
                    }
                    catch (ignore) {
                        // ignore
                    }
                    if (!success) {
                        if (new Date().getTime() > expires) {
                            const msg = 'salesforce.salesforcedx-vscode-core not installed or activated, some features unavailable';
                            console.log(msg);
                            reject(msg);
                        }
                        else {
                            setTimeout(dosetup, 100);
                        }
                    }
                };
                setTimeout(dosetup, 100);
            });
        }
        return wait;
    });
}
exports.waitForDX = waitForDX;
//# sourceMappingURL=waitForDX.js.map