import * as vscode from 'vscode';
import { ChatPanel } from './chatPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('AI Code Assistant extension is now active!');

    let disposable = vscode.commands.registerCommand('ai-code-assistant.openChat', () => {
        ChatPanel.createOrShow(context.extensionUri);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {} 