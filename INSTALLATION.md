# AI Code Assistant - Quick Installation Guide

## Quick Start

### Prerequisites

- Visual Studio Code 1.74.0 or higher
- Gemini API key (Google AI)

### Installation Steps

1. **Set up your Gemini API key**

   - Copy your Gemini API key from the Google Cloud Console.
   - Open `.vscode/settings.json` in your project (create the file if it does not exist).
   - Add the following, replacing `YOUR_GEMINI_API_KEY_HERE` with your actual key:

     ```json
     {
       "aiCodeAssistant.geminiApiKey": "YOUR_GEMINI_API_KEY_HERE",
       "aiCodeAssistant.model": "gemini-1.5-flash"
     }
     ```

   - **Note:** `.vscode/settings.json` is included in `.gitignore` to protect your API key from being committed to version control.

2. **Install the extension**

   - Open VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Extensions: Install from VSIX"
   - Select `ai-code-assistant-0.0.1.vsix` from this directory

3. **Open the chat interface**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Open AI Code Assistant"
   - Press Enter

## Key Features

### Chat Interface

- Modern React-based UI
- Real-time message exchange
- Markdown and code syntax highlighting
- Responsive design

### File Attachments

- Type `@filename` to attach files
- Intelligent file picker with search
- Automatic file content inclusion in AI context

### AI Code Assistance

- Code generation from natural language
- Debugging help
- Code review and suggestions
- Best practices guidance

## Example Usage

```
# Basic questions
"Create a React component for a todo list"
"Help me debug this function"
"Explain this code pattern"

# With file attachments
"@package.json - Review this configuration"
"@src/components/Button.tsx - What's wrong with this component?"
"@sample-test.js - Can you improve this code?"
```

## Development

### Building from source

```bash
# Install dependencies
npm install

# Build extension
npm run compile

# Development mode with watch
npm run watch

# Create VSIX package
npx vsce package
```

### Project Structure

```
src/
├── extension.ts          # Main extension entry
├── chatPanel.ts          # WebView management
├── aiService.ts          # Gemini integration
└── webview/              # React components
    ├── index.tsx         # React entry point
    ├── ChatInterface.tsx # Main chat component
    ├── MessageList.tsx   # Message display
    ├── MessageInput.tsx  # Input component
    ├── FileAttachment.tsx # File picker
    └── styles.css        # Styling
```

## Troubleshooting

### Common Issues

1. **"Failed to get AI response"**

   - Check your Gemini API key
   - Verify API credits
   - Check internet connection

2. **Extension not loading**

   - Ensure VS Code version ≥ 1.74.0
   - Check extension installation
   - Review developer console

3. **File attachments not working**
   - Ensure you're in a workspace
   - Check file permissions
   - Verify file exists

### Debug Mode

1. Open VS Code settings
2. Search for "AI Code Assistant"
3. Enable debug logging
4. Check Output panel for logs

## License

This project is licensed under the MIT License.

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review the VS Code developer console
3. Open an issue on the repository
