// Test script for Gemini API
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini API key
const apiKey = "AIzaSyCSf6lEUwpSIxPXmMVnT0qPfcsgTWH9oU4";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function testGemini() {
    try {
        console.log('Testing Gemini API...');
        
        const prompt = "Hello! Can you respond with 'Gemini API is working' if you receive this message?";
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Success! Response:', text);
        console.log('✅ Gemini API is working correctly!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.message.includes('400')) {
            console.error('❌ Invalid request');
        } else if (error.message.includes('401')) {
            console.error('❌ Invalid API key');
        } else if (error.message.includes('429')) {
            console.error('❌ Rate limit exceeded');
        } else if (error.message.includes('quota')) {
            console.error('❌ Insufficient API quota');
        } else {
            console.error('❌ Other error:', error.message);
        }
    }
}

testGemini(); 