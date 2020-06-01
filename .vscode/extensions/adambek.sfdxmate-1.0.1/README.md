# SFDX Mate for Visual Studio Code

This repository contains the source code for the SFDX Mate for Visual Studio Code (VS Code) extensions.

## Introduction

SFDX Mate is an extension for enhancing SFDX development in VS Code and is used as a companion to the Salesforce DX CLI and Salesforce Extension Pack for VS Code.

Currently, it has the following extension features:

**Deploy On Save**<br/>
During the save action of a file it deploys to the default username in the Salesforce DX project.<br/>


![Deploy On Save](https://github.com/adamluvshotsauce/sfdxmate/raw/master/images/sfdxmate-deploy-on-save.gif)

**Command Palette Features**<br/>
* `SFDX Mate: Change Default Org`<br/>
Introduces the ability to change the default username for a Salesforce DX project which is used by SFDX Mate.

* `SFDX Mate: Show Default Username`<br/>
Displays an information message with the designated default username for the Salesforce DX project.

* `SFDX Mate: Show Default Dev Hub`<br/>
Displays an information message with the designated default dev hub for the Salesforce DX project.


## Prerequisites

Before you install and setup this extension make sure you have the following:
* **Salesforce CLI**<br/>
Before you use SFDX Mate for VS Code, set up the [Salesforce CLI](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm).

* **Salesforce Extension Pack**<br/> 
For a more complete experience install the [Salesforce Extension Pack for VS Code](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode).

* **A Salesforce DX Project**<br/>
If you don't already have a Salesforce DX project you can [create one using the Salesforce CLI](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_workspace_setup.htm) or Salesforce Extension Pack.

## Release Notes

### 1.0.0

Initial release of `SFDX Mate`.

Included features: 
>`Deploy on Save`

Command Palette: 
>`SFDX Mate: Change Default Org`</br>
>`SFDX Mate: Show Default Username`</br>
>`SFDX Mate: Show Default Dev Hub`</br>

-----------------------------------------------------------------------------------------------------------

Special thanks to **@codefriar** and **@msrivastav13** for the inspiration!

