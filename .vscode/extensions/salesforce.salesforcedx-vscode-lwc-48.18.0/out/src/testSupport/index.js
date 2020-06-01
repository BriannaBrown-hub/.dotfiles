"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lwcTestCodeLensProvider_1 = require("./codeLens/lwcTestCodeLensProvider");
const commands_1 = require("./commands");
const testOutlineProvider_1 = require("./testExplorer/testOutlineProvider");
const testIndexer_1 = require("./testIndexer");
const taskService_1 = require("./testRunner/taskService");
const testResultsWatcher_1 = require("./testRunner/testResultsWatcher");
const context_1 = require("./utils/context");
function activateLwcTestSupport(context) {
    commands_1.registerCommands(context);
    lwcTestCodeLensProvider_1.registerLwcTestCodeLensProvider(context);
    testOutlineProvider_1.registerLwcTestExplorerTreeView(context);
    context_1.startWatchingEditorFocusChange(context);
    taskService_1.taskService.registerTaskService(context);
    testResultsWatcher_1.testResultsWatcher.register(context);
    testIndexer_1.lwcTestIndexer.register(context);
}
exports.activateLwcTestSupport = activateLwcTestSupport;
//# sourceMappingURL=index.js.map