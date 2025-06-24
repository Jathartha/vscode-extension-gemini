# AI Code Assistant - VS Code Extension

A Visual Studio Code extension that integrates a React-based web chat interface for AI-powered code assistance. The extension provides contextual awareness from your current workspace and supports file attachments using `@filename` syntax.

## Features

- Generate new code from natural language prompts
- Get help with debugging and code review
- Receive explanations of code patterns and best practices
- Contextual assistance based on your current workspace
- Modern, responsive chat interface built with React
- Real-time message exchange with typing indicators
- Markdown support with syntax-highlighted code blocks
- Clean, minimal design that integrates with VS Code themes
- Use `@filename` syntax to attach files from your workspace
- Intelligent file picker with search functionality
- Support for text files, images, and other file types
- File content is automatically included in AI context
- Automatic analysis of your current workspace
- AI assistant understands your project structure
- Contextual responses based on your codebase
- Support for multiple workspace folders

## Installation

### Prerequisites

- Visual Studio Code 1.74.0 or higher
- Node.js 16.x or higher
- Gemini API key (Google AI)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd coding-junior-assignment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up your Gemini API key**

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

4. **Build the extension**

   ```bash
   npm run compile
   ```

5. **Install the extension in VS Code**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Extensions: Install from VSIX"
   - Select the generated `.vsix` file from the `out` directory

## Usage

### Opening the Chat Interface

1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Open AI Code Assistant"
4. Press Enter

The chat interface will open in a new panel within VS Code.

### Basic Usage

- Ask questions: Type your question and press Enter
- Generate code: Ask the AI to create code for you
- Debug help: Describe an issue and get assistance
- Code review: Ask for feedback on your code

### File Attachments

To attach files to your messages:

1. Type `@` followed by the filename
2. A file picker will appear showing files from your workspace
3. Search and select the file you want to attach
4. The file content will be included in your message context

**Example:**

```
@package.json - Can you review this configuration?
```

### Example Prompts

- Create a React component for a todo list
- Help me debug this function
- Explain this code pattern
- @src/components/Button.tsx - Review this component
- Generate unit tests for this function
- What's wrong with this code?

## Development

### Project Structure

```
coding-junior-assignment/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── chatPanel.ts          # WebView panel management
│   ├── aiService.ts          # Gemini API integration
│   └── webview/              # React components
│       ├── index.tsx         # React entry point
│       ├── ChatInterface.tsx # Main chat component
│       ├── MessageList.tsx   # Message display
│       ├── MessageInput.tsx  # Input component
│       ├── FileAttachment.tsx # File picker
│       └── styles.css        # Styling
├── package.json              # Extension manifest
├── tsconfig.json            # TypeScript config
├── webpack.config.js        # Webpack config for React
└── README.md                # This file
```

### Building

Development mode (with watch):

```bash
npm run watch
```

Production build:

```bash
npm run compile
```

Extension only:

```bash
npm run compile:extension
```

WebView only:

```bash
npm run compile:webview
```

### Testing

```bash
npm test
```

## Configuration

### Gemini API Settings

The extension uses the Gemini API for AI responses. You can configure:

- **Model**: Currently uses `gemini-1.5-flash` (configurable in `.vscode/settings.json`)

### Workspace Context

The extension automatically analyzes your workspace to provide context to the AI:

- Reads up to 10 files from your workspace
- Excludes `node_modules` and other common ignore patterns
- Includes file content and structure information

## Troubleshooting

### Common Issues

- **Invalid API Key:** Ensure your Gemini API key is correct and active in your Google Cloud Console.
- **API Quota Exceeded:** If you exceed your quota, requests will fail. Check your Google Cloud Console for usage and limits.
- **Network Issues:** Ensure you have a stable internet connection and that your firewall or proxy is not blocking requests to the Gemini API.
- **Extension Not Picking Up Key:** Try reloading VS Code or restarting the extension if changes to `.vscode/settings.json` are not recognized.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. For major changes, open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
