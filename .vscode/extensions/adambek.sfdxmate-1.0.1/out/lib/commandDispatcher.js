"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandDispatcher {
    constructor() {
        this.sfdxForcePrefix = 'sfdx force:';
    }
    /* SOURCE METHODS */
    sourceCommand() {
        return this.sfdxForcePrefix + 'source:';
    }
    sourceDeploy(filePath) {
        console.log(this.sourceCommand() + 'deploy -p ' + filePath);
        return this.sourceCommand() + 'deploy -p ' + filePath;
    }
}
exports.CommandDispatcher = CommandDispatcher;
//# sourceMappingURL=commandDispatcher.js.map