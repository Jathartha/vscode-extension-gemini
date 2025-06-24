import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AIService } from './aiService';

export class ChatPanel {
    public static currentPanel: ChatPanel | undefined;
    public static readonly viewType = 'aiCodeAssistant';
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private _aiService: AIService;

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (ChatPanel.currentPanel) {
            ChatPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            ChatPanel.viewType,
            'AI Code Assistant',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'media'),
                    vscode.Uri.joinPath(extensionUri, 'out/compiled')
                ]
            }
        );

        ChatPanel.currentPanel = new ChatPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._aiService = new AIService();

        this._setWebviewMessageListener(this._panel.webview);
        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    public createOrShow() {
        ChatPanel.createOrShow(this._extensionUri);
    }

    public dispose() {
        ChatPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private async _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUriOnDisk = vscode.Uri.joinPath(this._extensionUri, 'out', 'compiled', 'webview.js');
        const scriptUri = webview.asWebviewUri(scriptUriOnDisk);
        const styleUriOnDisk = vscode.Uri.joinPath(this._extensionUri, 'out', 'compiled', 'webview.css');
        const styleUri = webview.asWebviewUri(styleUriOnDisk);

        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
                <title>AI Code Assistant</title>
                <link rel="stylesheet" type="text/css" href="${styleUri}">
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }

    private _setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'sendMessage':
                        await this._handleSendMessage(message.text, message.attachments);
                        return;
                    case 'getWorkspaceFiles':
                        await this._handleGetWorkspaceFiles();
                        return;
                    case 'getFileContent':
                        await this._handleGetFileContent(message.filePath);
                        return;
                }
            },
            undefined,
            this._disposables
        );
    }

    private async _handleSendMessage(text: string, attachments: string[]) {
        try {
            // Get workspace context
            const workspaceContext = await this._getWorkspaceContext();
            
            // Get attached file contents
            const attachmentContents = await this._getAttachmentContents(attachments);
            
            // Send to AI service
            const response = await this._aiService.sendMessage(text, workspaceContext, attachmentContents);
            
            // Send response back to webview
            this._panel.webview.postMessage({
                command: 'receiveMessage',
                text: response,
                isAI: true
            });
        } catch (error) {
            console.error('Error sending message:', error);
            this._panel.webview.postMessage({
                command: 'receiveMessage',
                text: 'Sorry, I encountered an error. Please try again.',
                isAI: true,
                isError: true
            });
        }
    }

    private async _handleGetWorkspaceFiles() {
        try {
            const files = await this._getWorkspaceFiles();
            this._panel.webview.postMessage({
                command: 'workspaceFiles',
                files: files
            });
        } catch (error) {
            console.error('Error getting workspace files:', error);
        }
    }

    private async _handleGetFileContent(filePath: string) {
        try {
            const content = await this._getFileContent(filePath);
            this._panel.webview.postMessage({
                command: 'fileContent',
                filePath: filePath,
                content: content
            });
        } catch (error) {
            console.error('Error getting file content:', error);
        }
    }

    private async _getWorkspaceContext(): Promise<string> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return '';
        }

        const context: string[] = [];
        
        for (const folder of workspaceFolders) {
            const files = await vscode.workspace.findFiles(
                new vscode.RelativePattern(folder, '**/*'),
                '**/node_modules/**'
            );

            for (const file of files.slice(0, 10)) { // Limit to first 10 files
                try {
                    const content = await vscode.workspace.fs.readFile(file);
                    const relativePath = vscode.workspace.asRelativePath(file);
                    context.push(`File: ${relativePath}\nContent:\n${content.toString()}\n`);
                } catch (error) {
                    console.error(`Error reading file ${file.fsPath}:`, error);
                }
            }
        }

        return context.join('\n');
    }

    private async _getWorkspaceFiles(): Promise<string[]> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return [];
        }

        const files: string[] = [];
        
        for (const folder of workspaceFolders) {
            const foundFiles = await vscode.workspace.findFiles(
                new vscode.RelativePattern(folder, '**/*'),
                '**/node_modules/**'
            );

            files.push(...foundFiles.map(file => vscode.workspace.asRelativePath(file)));
        }

        return files;
    }

    private async _getFileContent(filePath: string): Promise<string> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folder found');
        }

        const fullPath = path.join(workspaceFolders[0].uri.fsPath, filePath);
        const content = await vscode.workspace.fs.readFile(vscode.Uri.file(fullPath));
        return content.toString();
    }

    private async _getAttachmentContents(attachments: string[]): Promise<string[]> {
        const contents: string[] = [];
        
        for (const attachment of attachments) {
            try {
                const content = await this._getFileContent(attachment);
                contents.push(`File: ${attachment}\nContent:\n${content}`);
            } catch (error) {
                console.error(`Error reading attachment ${attachment}:`, error);
                contents.push(`File: ${attachment}\nError: Could not read file`);
            }
        }

        return contents;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
} 