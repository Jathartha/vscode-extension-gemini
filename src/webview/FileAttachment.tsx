import React, { useState } from 'react';
import { WorkspaceFile } from './ChatInterface';

interface FileAttachmentProps {
    workspaceFiles: WorkspaceFile[];
    onSelectFile: (filePath: string) => void;
    onClose: () => void;
}

export const FileAttachment: React.FC<FileAttachmentProps> = ({
    workspaceFiles,
    onSelectFile,
    onClose
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFiles = workspaceFiles.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.path.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 20); // Limit to first 20 results

    const handleFileSelect = (filePath: string) => {
        onSelectFile(filePath);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="file-attachment-overlay" onClick={onClose}>
            <div className="file-attachment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="file-attachment-header">
                    <h3>Attach File</h3>
                    <button onClick={onClose} className="close-button">×</button>
                </div>
                
                <div className="file-attachment-search">
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="file-search-input"
                    />
                </div>

                <div className="file-attachment-list">
                    {filteredFiles.length === 0 ? (
                        <div className="no-files">
                            {searchTerm ? 'No files found matching your search.' : 'No files in workspace.'}
                        </div>
                    ) : (
                        filteredFiles.map((file) => (
                            <div
                                key={file.path}
                                className="file-item"
                                onClick={() => handleFileSelect(file.path)}
                            >
                                <div className="file-icon">
                                    {getFileIcon(file.name)}
                                </div>
                                <div className="file-info">
                                    <div className="file-name">{file.name}</div>
                                    <div className="file-path">{file.path}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="file-attachment-footer">
                    <span className="file-count">
                        {filteredFiles.length} of {workspaceFiles.length} files
                    </span>
                    <button onClick={onClose} className="cancel-button">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
            return '📄';
        case 'json':
            return '📋';
        case 'md':
            return '📝';
        case 'css':
        case 'scss':
        case 'sass':
            return '🎨';
        case 'html':
            return '🌐';
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'svg':
            return '🖼️';
        case 'pdf':
            return '📕';
        case 'txt':
            return '📄';
        default:
            return '📁';
    }
}; 