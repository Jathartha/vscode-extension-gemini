import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
    onSendMessage: (text: string) => void;
    onInputChange: (text: string) => void;
    isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
    onSendMessage, 
    onInputChange, 
    isLoading 
}) => {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInputValue(value);
        onInputChange(value);
    };

    const handleSend = () => {
        if (inputValue.trim() && !isLoading) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="message-input-container">
            <div className="input-wrapper">
                <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... Use @filename to attach files"
                    disabled={isLoading}
                    className="message-input"
                    rows={1}
                />
                <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className="send-button"
                >
                    {isLoading ? (
                        <div className="send-loading">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                                fill="currentColor"
                            />
                        </svg>
                    )}
                </button>
            </div>
            
            <div className="input-hints">
                <span className="hint">
                    💡 Press Enter to send, Shift+Enter for new line
                </span>
                <span className="hint">
                    📎 Type @filename to attach files from your workspace
                </span>
            </div>
        </div>
    );
}; 