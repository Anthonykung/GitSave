/******************************************
 *                                        *
 * Name: extension.js                     *
 * Description: GitSafe VS Code Extension *
 * Date: January 24, 2021                 *
 * Created by: Anthony Kung               *
 * Author URL: https://anth.dev           *
 * License: Apache-2.0 (See LICENSE.md)   *
 *                                        *
 ******************************************/

console.log('\x1b[92m>_ GitSave Activating');

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec, spawn, spawnSync } = require('child_process');
const { createModuleResolutionCache, createEnumDeclaration } = require('typescript');
const fs = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('\x1b[92m>_ GitSave Activated!');
	vscode.window.showInformationMessage('GitSave Activated!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('gitsave.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from GitSave!');
	});

	let gitsavestatus = 0;
	let gitsaveshow = 1;
	let commitcmd = null;
	let testcmd = null;

	let save = vscode.workspace.onDidSaveTextDocument((TextDocument) => {
		if (TextDocument.uri.scheme === "file" && gitsavestatus == 1) {
			let curry = new Date().toUTCString();
			let curryFile = vscode.workspace.asRelativePath(TextDocument.uri.path);
			if (!commitcmd) {
				commitcmd = vscode.window.createTerminal("GitSave Commit");
			}
			else if (commitcmd.exitStatus || !gitsaveshow) {
				commitcmd.dispose();
				commitcmd = vscode.window.createTerminal("GitSave Commit");
			}
			commitcmd.sendText('git add ' + curryFile + '\n');
			commitcmd.sendText('git commit ' + curryFile + ' -m "Update at ' + curry + '"\n');
			if (gitsaveshow) {
				commitcmd.show();
			}
			else {
				commitcmd.hide();
			}
			vscode.window.showInformationMessage('GitSave Comitted');
		}
		else {
			vscode.window.showInformationMessage('GitSave Not Enabled');
		}
	});

	let gpgtest = vscode.commands.registerCommand('gitsave.gpgtest', function () {
		if (!testcmd) {
			testcmd = vscode.window.createTerminal("GitSave GPG Test");
		}
		else if (testcmd.exitStatus) {
			testcmd.dispose();
			testcmd = vscode.window.createTerminal("GitSave GPG Test");
		}
		testcmd.sendText('echo "GitSave Test" | gpg --clearsign\n');
		testcmd.show();
	});

	let disable = vscode.commands.registerCommand('gitsave.disable', function () {
		gitsavestatus = 0;
		vscode.window.showInformationMessage('GitSave Disabled');
	});

	let enable = vscode.commands.registerCommand('gitsave.enable', function () {
		gitsavestatus = 1;
		vscode.window.showInformationMessage('GitSave Enabled');
	});

	let cmdshow = vscode.commands.registerCommand('gitsave.show', function () {
		gitsaveshow = 1;
		vscode.window.showInformationMessage('GitSave Showing');
	});

	let cmdhide = vscode.commands.registerCommand('gitsave.hide', function () {
		gitsaveshow = 0;
		vscode.window.showInformationMessage('GitSave Hidden');
	});

	context.subscriptions.push(
		gpgtest,
		enable,
		disable,
		cmdshow,
		cmdhide
	);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
