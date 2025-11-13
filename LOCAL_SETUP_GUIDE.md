# PromptEngine - Local Setup Guide

## Prerequisites

Before running this project locally, ensure you have the following installed on your system:

### Required Software:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)

### Required API Key:
- **Google Gemini API Key** - Get one from [AI Studio](https://aistudio.google.com/app/apikey)

## Quick Start

Follow these steps to get PromptEngine running on your local machine:

### 1. Navigate to Project Directory
```bash
cd Prompt-Engine
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Key
1. Open the `.env.local` file that was created in the project root
2. Replace `your_gemini_api_key_here` with your actual Google Gemini API key

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Your Browser
Navigate to `http://localhost:3000` in your web browser.

## Available Scripts

- **`npm run dev`**: Start development server with hot reload
- **`npm run build`**: Build the project for production
- **`npm run preview`**: Preview the production build

## Project Features

### Core Functionality:
- **AI Prompt Generation**: Transform simple ideas into structured, optimized prompts
- **File Context Support**: Upload documents, images, or other files as context
- **Prompt Testing**: Test generated prompts to see actual AI responses
- **History Management**: Save, organize, and rate your prompt history
- **Theme Support**: Toggle between dark and light modes

### Technical Features:
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: All data is stored locally in your browser
- **TypeScript**: Full type safety and better development experience
- **Modern React**: Built with React 19 and functional components

## Troubleshooting

### Common Issues:

#### 1. API Key Issues
- **Error**: "Failed to generate prompt. Please check your API key"
- **Solution**: 
  - Verify your API key in `.env.local` is correct
  - Ensure your Gemini API key has proper permissions
  - Check that the API key is activated in Google AI Studio

#### 2. Port Already in Use
- **Error**: "Port 3000 is already in use"
- **Solution**: 
  - Kill the process using port 3000: `lsof -ti:3000 | xargs kill`
  - Or run on a different port: `npm run dev -- --port 3001`

#### 3. Dependencies Issues
- **Error**: Package installation fails
- **Solution**: 
  - Clear npm cache: `npm cache clean --force`
  - Delete `node_modules` and `package-lock.json`
  - Reinstall: `npm install`

#### 4. Build Errors
- **Error**: TypeScript compilation errors
- **Solution**: 
  - Ensure all dependencies are properly installed
  - Check TypeScript configuration in `tsconfig.json`

## Project Architecture

### Components Structure:
```
components/
├── FileUpload.tsx        # Handles file uploads and previews
├── HistoryPanel.tsx      # Prompt history with search and filtering
├── HowToUse.tsx          # Usage instructions and help
├── PromptForm.tsx        # Main form for entering ideas
├── PromptResult.tsx      # Display generated prompts with actions
├── StructuredPrompt.tsx  # Structured view of generated prompts
└── icons/               # SVG icon components
```

### Services:
- **`services/geminiService.ts`**: Integration with Google Gemini AI
  - `generateOptimizedPrompt()`: Creates structured prompts from ideas
  - `testPrompt()`: Tests prompts against the AI model

### Hooks:
- **`hooks/useLocalStorage.ts`**: Custom hook for persistent local storage

## Configuration Files

### Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key (required)

### Vite Configuration
- Port: 3000 (default)
- Host: 0.0.0.0 (accessible from any IP)
- Path alias: `@/` maps to project root

## Production Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory. You can serve these files with any static file server.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your API key and network connection
3. Ensure all dependencies are properly installed
4. Check browser console for any JavaScript errors

## License

This project is for personal use. Please respect Google's API terms of service when using the Gemini AI integration.