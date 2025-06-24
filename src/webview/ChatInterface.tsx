import React, { useState, useEffect, useRef } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { FileAttachment } from './FileAttachment';

declare global {
    interface Window {
        acquireVsCodeApi: () => {
            postMessage: (message: any) => void;
            getState: () => any;
            setState: (state: any) => void;
        };
    }
}

const vscode = window.acquireVsCodeApi();

export interface Message {
    id: string;
    text: string;
    isAI: boolean;
    isError?: boolean;
    attachments?: string[];
    timestamp: Date;
}

export interface WorkspaceFile {
    path: string;
    name: string;
}

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFile[]>([]);
    const [showFilePicker, setShowFilePicker] = useState(false);
    const [attachments, setAttachments] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Request workspace files on mount
        vscode.postMessage({ command: 'getWorkspaceFiles' });

        // Listen for messages from the extension
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            
            switch (message.command) {
                case 'receiveMessage':
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        text: message.text,
                        isAI: true,
                        isError: message.isError,
                        timestamp: new Date()
                    }]);
                    setIsLoading(false);
                    break;
                case 'workspaceFiles':
                    const files = message.files.map((file: string) => ({
                        path: file,
                        name: file.split('/').pop() || file
                    }));
                    setWorkspaceFiles(files);
                    break;
                case 'fileContent':
                    // Handle file content if needed
                    break;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: text.trim(),
            isAI: false,
            attachments: [...attachments],
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setAttachments([]);

        // Send message to extension
        vscode.postMessage({
            command: 'sendMessage',
            text: text.trim(),
            attachments: attachments
        });
    };

    const handleFileAttachment = (filePath: string) => {
        if (!attachments.includes(filePath)) {
            setAttachments(prev => [...prev, filePath]);
        }
        setShowFilePicker(false);
    };

    const removeAttachment = (filePath: string) => {
        setAttachments(prev => prev.filter(path => path !== filePath));
    };

    const handleInputChange = (text: string) => {
        // Check for @filename pattern
        const atMatch = text.match(/@(\w*)$/);
        if (atMatch) {
            setShowFilePicker(true);
        } else {
            setShowFilePicker(false);
        }
    };

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <h2>AI Code Assistant</h2>
                <p>Ask me anything about your code or get help with development tasks</p>
            </div>

            <div className="chat-messages">
                <MessageList 
                    messages={messages} 
                    isLoading={isLoading}
                />
                <div ref={messagesEndRef} />
            </div>

            {attachments.length > 0 && (
                <div className="attachments">
                    <h4>Attached Files:</h4>
                    {attachments.map(filePath => (
                        <div key={filePath} className="attachment-item">
                            <span>📎 {filePath}</span>
                            <button 
                                onClick={() => removeAttachment(filePath)}
                                className="remove-attachment"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="chat-input-container">
                <MessageInput 
                    onSendMessage={handleSendMessage}
                    onInputChange={handleInputChange}
                    isLoading={isLoading}
                />
                
                {showFilePicker && (
                    <FileAttachment 
                        workspaceFiles={workspaceFiles}
                        onSelectFile={handleFileAttachment}
                        onClose={() => setShowFilePicker(false)}
                    />
                )}
            </div>
        </div>
    );
}; 