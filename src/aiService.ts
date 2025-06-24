import * as vscode from 'vscode';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        // Get API key from VS Code settings or environment variable
        const config = vscode.workspace.getConfiguration('aiCodeAssistant');
        const apiKey = config.get<string>('geminiApiKey') || process.env.GEMINI_API_KEY || '';
        
        if (!apiKey) {
            throw new Error('Gemini API key not found. Please set it in VS Code settings (aiCodeAssistant.geminiApiKey) or as an environment variable (GEMINI_API_KEY).');
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        
        // Get model configuration
        const modelName = config.get<string>('model', 'gemini-1.5-flash');
        this.model = this.genAI.getGenerativeModel({ model: modelName });
    }

    async sendMessage(
        userMessage: string, 
        workspaceContext: string, 
        attachmentContents: string[]
    ): Promise<string> {
        try {
            // Build the system prompt with context
            const systemPrompt = this._buildSystemPrompt(workspaceContext, attachmentContents);
            
            // Create the full prompt
            const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;
            
            // Generate content
            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();
            
            return text || 'No response received';
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            
            // Provide more specific error messages
            if (error instanceof Error) {
                if (error.message.includes('400')) {
                    throw new Error('Invalid request to Gemini API. Please check your input.');
                } else if (error.message.includes('401')) {
                    throw new Error('Invalid Gemini API key. Please check your API key in VS Code settings (aiCodeAssistant.geminiApiKey).');
                } else if (error.message.includes('429')) {
                    throw new Error('Gemini API rate limit exceeded. Please try again later.');
                } else if (error.message.includes('quota')) {
                    throw new Error('Insufficient Gemini API quota. Please check your Gemini API quota.');
                } else if (error.message.includes('network')) {
                    throw new Error('Network error. Please check your internet connection.');
                }
            }
            
            throw new Error('Failed to get Gemini AI response. Please check your Gemini API key and try again.');
        }
    }

    private _buildSystemPrompt(workspaceContext: string, attachmentContents: string[]): string {
        let prompt = `You are an AI code assistant integrated into Visual Studio Code. Your role is to help developers with:\n\n1. Code generation and modification\n2. Code review and suggestions\n3. Debugging assistance\n4. Best practices and architectural guidance\n5. Documentation and explanations\n\nPlease provide clear, concise, and actionable responses. When generating code, ensure it follows best practices and is well-commented.\n\nCurrent workspace context:\n${workspaceContext}\n\n`;

        if (attachmentContents.length > 0) {
            prompt += `\nAttached files:\n${attachmentContents.join('\n\n')}\n\n`;
        }

        prompt += `\nPlease respond in a helpful and professional manner. If you're generating code, make sure it's properly formatted and ready to use.`;

        return prompt;
    }
} 