// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const { exec } = require('child_process');
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sfdx-cli" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });
    
    var newApexClass = vscode.commands.registerCommand('extension.newApexClass', function(uri){
        if(uri === undefined){
            vscode.window.showInformationMessage('This command should run in the explorer menu context');
            return;
        }
        var thePath = vscode.Uri.parse(uri).fsPath;
        vscode.window.showInputBox({prompt: 'Enter a name for your new apex class:'}).then(val =>{
            exec('sfdx force:apex:class:create -n ' + val + ' -d ' + thePath, (error, stdout, stderr) =>{
                if(error || val == null){
                    vscode.window.showInformationMessage(error.message);
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
        });
        
    });
    var newLightningApp = vscode.commands.registerCommand('extension.newLightningApp', function(uri){
        if(uri === undefined){
            vscode.window.showInformationMessage('This command should run in the explorer menu context');
            return;
        }
        var thePath = vscode.Uri.parse(uri).fsPath;
        vscode.window.showInputBox({prompt: 'Enter a name for your new lightning app:'}).then(val =>{
            exec('sfdx force:lightning:app:create -n ' + val + ' -d ' + thePath, (error, stdout, stderr) =>{
                if(error || val == null){
                    vscode.window.showInformationMessage(error.message);
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
        });
        
    });
    var newLightningComponent = vscode.commands.registerCommand('extension.newLightningComponent', function(uri){
        if(uri === undefined){
            vscode.window.showInformationMessage('This command should run in the explorer menu context');
            return;
        }
        var thePath = vscode.Uri.parse(uri).fsPath;
        vscode.window.showInputBox({prompt: 'Enter a name for your new lightning component:'}).then(val =>{
            exec('sfdx force:lightning:component:create -n ' + val + ' -d ' + thePath, (error, stdout, stderr) =>{
                if(error || val == null){
                    vscode.window.showInformationMessage(error.message);
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
        });
        
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;