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
const { stderr } = require('process');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

/************************************************
 * Begin Global Extension Variables & Constants *
 ************************************************/

// Colors & Prefix & Stuff
let pink = '\x1b[38;2;255;20;147m';
let ori = '\x1b[0m';
let red = '\x1b[91m';
let green = '\x1b[92m';
let yellow = '\x1b[93m';
let blue = '\x1b[94m';
let cyan = '\x1b[96m';
let prefix = '>_ ';
let extName = 'GitSave';
let extPre = prefix + extName;
let extErr = red + extPre + 'ERROR:';
let extWarn = yellow + extPre + 'WARNING:';
let extSuc = green + extPre + 'SUCCESS:';
let extMsg = blue + extPre;
let extEnd = '\n' + ori;

// Terminal
let gsCommitCmd = null;
let gsTestCmd = null;

/**********************************************
 * End Global Extension Variables & Constants *
 **********************************************/

function activate(context) {

	// Check If Git Exist
	exec('git --version', (error, stdout, stderr) => {
		if (error) {
			console.error(extErr, 'Terminal return the following error:' + extEnd, error);
			console.error(extErr, 'GitSave Deactivated, use `GitSave: Launch` to reactivate.' + extEnd);
			deactivate();
		}
		else if (stderr) {
			console.error(extErr, 'Terminal return the following error:' + extEnd, stderr);
			console.error(extErr, 'GitSave Deactivated, use `GitSave: Launch` to reactivate.' + extEnd);
			deactivate();
		}
	});

	// Declare Variables
	const config = vscode.workspace.getConfiguration('gitSave');
	let gsEnable = config.get('operation.enableByDefault');
	let gsShowCommitTerminal = config.get('operation.showCommitTerminal');
	let gsShowCommitMessage = config.get('notification.showCommitMessages');
	let gsShowActivation = config.get('notification.showActivationMessages');

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('\x1b[92m>_ GitSave Activated!');
	if (gsShowActivation) {
		vscode.window.showInformationMessage('GitSave Activated!');
	}

	vscode.workspace.onDidSaveTextDocument((TextDocument) => {
		// Check if document is a file and if GitSave is enabled
		if (TextDocument.uri.scheme === "file" && gsEnable == 1) {
			// Get timestamp
			let curry = new Date().toUTCString();
			// Get current file absolute path
			let curryFile = TextDocument.uri.path;
			// Check if terminal already exist
			if (!gsCommitCmd) {
				gsCommitCmd = vscode.window.createTerminal("GitSave Commit");
			}
			// If terminal do not exist or has exited
			else if (gsCommitCmd.exitStatus || !gsShowCommitTerminal) {
				// Get rid of the terminal
				gsCommitCmd.dispose();
				if (gsShowCommitMessage)
				gsCommitCmd = vscode.window.createTerminal("GitSave Commit");
			}
			gsCommitCmd.sendText('git add ' + curryFile + '\n');
			gsCommitCmd.sendText('git commit ' + curryFile + ' -m "Update at ' + curry + '"\n');
			if (gsShowCommitTerminal) {
				gsCommitCmd.show();
			}
			else {
				gsCommitCmd.hide();
			}
			vscode.window.showInformationMessage('GitSave Comitted');
		}
		else {
			vscode.window.showInformationMessage('GitSave Not Enabled');
		}
	});

	let gpgtest = vscode.commands.registerCommand('gitsave.gpgtest', function () {
		if (!gsTestCmd) {
			gsTestCmd = vscode.window.createTerminal("GitSave GPG Test");
		}
		else if (gsTestCmd.exitStatus) {
			gsTestCmd.dispose();
			gsTestCmd = vscode.window.createTerminal("GitSave GPG Test");
		}
		gsTestCmd.sendText('echo "GitSave Test" | gpg --clearsign\n');
		gsTestCmd.show();
	});

	let disable = vscode.commands.registerCommand('gitsave.disable', function () {
		gsEnable = 0;
		vscode.window.showInformationMessage('GitSave Disabled');
	});

	let enable = vscode.commands.registerCommand('gitsave.enable', function () {
		gsEnable = 1;
		vscode.window.showInformationMessage('GitSave Enabled');
	});

	let cmdshow = vscode.commands.registerCommand('gitsave.show', function () {
		gsShowCommitTerminal = 1;
		vscode.window.showInformationMessage('GitSave Showing');
	});

	let cmdhide = vscode.commands.registerCommand('gitsave.hide', function () {
		gsShowCommitTerminal = 0;
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
function deactivate() {
	// Get rid of the terminal
	if (gsCommitCmd) {
		gsCommitCmd.dispose();
	}
	if (gsTestCmd) {
		gsTestCmd.dispose();
	}
}

module.exports = {
	activate,
	deactivate
}
