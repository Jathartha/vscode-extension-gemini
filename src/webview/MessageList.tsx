import React from 'react';
import { Message } from './ChatInterface';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
    const formatTimestamp = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="message-list">
            {messages.length === 0 && !isLoading && (
                <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <h3>Start a conversation</h3>
                    <p>Ask me to help you with code generation, debugging, or any development questions.</p>
                    <div className="suggestions">
                        <div className="suggestion">
                            <strong>Try asking:</strong>
                            <ul>
                                <li>"Create a React component for a todo list"</li>
                                <li>"Help me debug this function"</li>
                                <li>"Explain this code pattern"</li>
                                <li>"@filename - review this file"</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {messages.map((message) => (
                <div 
                    key={message.id} 
                    className={`message ${message.isAI ? 'ai-message' : 'user-message'} ${message.isError ? 'error-message' : ''}`}
                >
                    <div className="message-header">
                        <div className="message-avatar">
                            {message.isAI ? '🤖' : '👤'}
                        </div>
                        <div className="message-info">
                            <span className="message-author">
                                {message.isAI ? 'AI Assistant' : 'You'}
                            </span>
                            <span className="message-time">
                                {formatTimestamp(message.timestamp)}
                            </span>
                        </div>
                    </div>
                    
                    <div className="message-content">
                        <div className="message-text">
                            <ReactMarkdown
                                children={message.text}
                                components={{
                                    code({node, inline, className, children, ...props}: any) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={oneDark}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            />
                        </div>
                        
                        {message.attachments && message.attachments.length > 0 && (
                            <div className="message-attachments">
                                <strong>Attached files:</strong>
                                {message.attachments.map(filePath => (
                                    <div key={filePath} className="attachment-tag">
                                        📎 {filePath}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="message ai-message loading-message">
                    <div className="message-header">
                        <div className="message-avatar">🤖</div>
                        <div className="message-info">
                            <span className="message-author">AI Assistant</span>
                        </div>
                    </div>
                    <div className="message-content">
                        <div className="loading-indicator">
                            <div className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span>Thinking...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 