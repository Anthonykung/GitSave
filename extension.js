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
const path = require('path');
const { SIGPIPE } = require('constants');

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
let extErr = red + extPre + ' ERROR:';
let extWarn = yellow + extPre + ' WARNING:';
let extSuc = green + extPre + ' SUCCESS:';
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
	// This initialize the variables with default
	// but allow user to overwrite with command palette
	const config = vscode.workspace.getConfiguration('gitSave');
	let gsEnable = config.get('operation.enableByDefault');
	let gsShowCommitTerminal = config.get('operation.showCommitTerminal');
	let gsShowCommitMessage = config.get('notification.showCommitMessages');
	let gsShowActivation = config.get('notification.showActivationMessages');
	let gsShowDisabledMessage = config.get('notification.showDisabledMessages');
	let gsUseTerminal = config.get('operation.useTerminal');

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(extSuc, 'GitSave Activated!');
	if (gsShowActivation) {
		vscode.window.showInformationMessage('GitSave Activated!');
	}

	vscode.workspace.onDidSaveTextDocument((TextDocument) => {
		// Check if document is a file and if GitSave is enabled
		if (TextDocument.uri.scheme === "file" && gsEnable == 1) {
			console.log(extSuc, 'GitSave Active');
			// Get timestamp
			let curry = new Date().toUTCString();
			// Get current file absolute path
			let curryFile = TextDocument.uri.path;
			// Get current directory absolute path
			let curryDir = path.dirname(curryFile);
			console.log(extMsg, 'File located in', curryDir);
			if (gsUseTerminal) {
				gsRunGitOptInTerminal(gsShowCommitTerminal, curryFile, curry);
			}
			else {
				gsRunGitOperation(curryFile, curryDir, curry);
			}
			// Check if user wants to show commit message
			if (gsShowCommitMessage) {
				console.log(extSuc, 'GitSave Comitted', extEnd);
				vscode.window.showInformationMessage('GitSave Comitted');
			}
		}
		// Check if user wants to show Disabled warning
		else if (gsShowDisabledMessage) {
			// Show warning and offer an option to enable
			console.error(extErr, 'GitSave Not Enabled', extEnd);
			vscode.window.showErrorMessage('GitSave Not Enabled', 'Enable')
				.then(enable => {
					if (enable) {
						gsEnable = 1;
						console.log(extSuc, 'GitSave Enabled', extEnd);
						vscode.window.showInformationMessage('GitSave Enabled');
					}
				});
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

	let usecmd = vscode.commands.registerCommand('gitsave.useTerminal', function () {
		gsUseTerminal = 1;
		vscode.window.showInformationMessage('GitSave Using Terminal');
	});

	let nocmd = vscode.commands.registerCommand('gitsave.notUseTerminal', function () {
		gsUseTerminal = 0;
		vscode.window.showInformationMessage('GitSave Not Using Terminal');
	});

	process.on('unhandledRejection', (reason, promise) => {
		console.error(extErr, 'Unhandled Rejection:\n', reason, extEnd);
		console.error(extErr, 'Returned Promise:\n', promise, extEnd);
	});

	context.subscriptions.push(
		gpgtest,
		enable,
		disable,
		cmdshow,
		cmdhide,
		usecmd,
		nocmd
	);
}
exports.activate = activate;

async function gsGetGPGPass() {
	let gsGPGPassphrase = await vscode.window.showInputBox({ password: true, prompt: 'Enter GPG Passphrase' });
	return gsGPGPassphrase;
}

async function gsRunGitAdd(curryFile, curryDir) {
	console.log(extMsg, 'Running git add');
	// Run git add
	let str = 'cd ' + curryDir + ' && git add ' + curryFile + '\n';
	exec(str, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage('GitSave: git add error, see log file for more info');
			console.error(extErr, 'git add return the following error:' + extEnd + error);
		}
		else if (stderr) {
			vscode.window.showErrorMessage('GitSave: git add error, see log file for more info');
			console.error(extErr, 'git add return the following error:' + extEnd + stderr);
		}
		else if (stdout) {
			console.log(extSuc, 'git add return the following output:' + extEnd + stdout);
		}
		else {
			console.log(extSuc, 'git add completed' + extEnd);
		}
	});
}

async function gsRunGitCommit(curryFile, curryDir, curry) {
	console.log(extMsg, 'Running git commit');
	// Run git commit
	let str = 'cd ' + curryDir + ' && git commit ' + curryFile + ' -m "Update at ' + curry + '"\n';
	exec(str, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage('GitSave: git commit error, see log file for more info. Note: This error will show if you do not cache your GPG passphrase and uses GPG commit by default. Try using GPG Test for linux users on Command Palette or enable VS Code terminal on Command Palette.');
			console.error(extErr, 'git commit return the following error:' + extEnd + error);
		}
		else if (stderr) {
			vscode.window.showErrorMessage('GitSave: git commit error, see log file for more info');
			console.error(extErr, 'git commit return the following stderr:' + extEnd + stderr);
		}
		else if (stdout) {
			console.log(extSuc, 'git commit return the following output:' + extEnd + stdout);
		}
		else {
			console.log(extSuc, 'git commit completed' + extEnd);
		}
	});
	// let gsCommit = spawn(str);
	// if (gsCommit.stdin.writable) {
	// 	console.log(extSuc, 'GitSave Commit Writable', extEnd);
	// 	let gsGPGPassphrase = await gsGetGPGPass();
	// 	console.log('GPG: ' + gsGPGPassphrase);
	// 	gsCommit.on('message', (message) => {
	// 		console.log(extMsg, 'GitSave Commit Return:\n', message, extEnd);
	// 	});
	// 	gsCommit.on('disconnect', () => {
	// 		vscode.window.showErrorMessage('GitSave: Commit Error');
	// 		console.error(extErr, 'git commit disconnected', extEnd);
	// 		gsCommit.stdin.end();
	// 		gsCommit.kill();
	// 	});
	// 	gsCommit.on('close', (code) => {
	// 		console.log(extMsg, 'git commit closed code', code, extEnd);
	// 	});
	// 	gsCommit.on('exit', (code) => {
	// 		console.log(extMsg, 'git commit exited code', code, extEnd);
	// 	});
	// 	gsCommit.on('error', (err) => {
	// 		vscode.window.showErrorMessage('GitSave: Commit Error');
	// 		console.error(extErr, 'git commit disconnected', err, extEnd);
	// 		gsCommit.stdin.end();
	// 		gsCommit.kill();
	// 	});
	// 	gsCommit.stdout.on('data', (stdout) => {
	// 		console.log(extSuc, 'git commit return the following output:' + extEnd, stdout);
	// 	});
	// 	gsCommit.stderr.on('data', (error) => {
	// 		vscode.window.showErrorMessage('GitSave: Commit Error');
	// 		console.error(extErr, 'git commit return the following error:' + extEnd, error);
	// 	});
	// 	gsCommit.stdin.write(gsGPGPassphrase + '\n');
	// }
	// else {
	// 	console.error(extWarn, 'GitSave Commit Not Writable', extEnd);
	// }
	// gsCommit.stdin.end();
	console.log(extSuc, 'git commit completed' + extEnd);
}

async function gsRunGitOperation(curryFile, curryDir, curry) {
	await gsRunGitAdd(curryFile, curryDir);
	await gsRunGitCommit(curryFile, curryDir, curry);
}

async function gsRunGitOptInTerminal(gsShowCommitTerminal, curryFile, curry) {
	// Check if terminal already exist
	if (gsCommitCmd == null) {
		console.log(extMsg, 'Creating Terminal');
		gsCommitCmd = vscode.window.createTerminal("GitSave Commit");
	}
	// If terminal do not exist or has exited
	else if (gsCommitCmd.exitStatus) {
		console.log(extMsg, 'Removing Exited Terminal');
		// Get rid of the terminal
		gsCommitCmd.dispose();
		console.log(extMsg, 'Creating Terminal');
		// Create terminal
		gsCommitCmd = vscode.window.createTerminal("GitSave Commit");
	}
	gsCommitCmd.sendText('git add ' + curryFile + '\n');
	gsCommitCmd.sendText('git commit ' + curryFile + ' -m "Update at ' + curry + '"\n');
	// Check if user wants to show commit terminal
	if (gsShowCommitTerminal) {
		console.log(extMsg, 'Showing Terminal');
		gsCommitCmd.show();
	}
	else {
		console.log(extMsg, 'Hiding Terminal');
		gsCommitCmd.hide();
	}
}

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
