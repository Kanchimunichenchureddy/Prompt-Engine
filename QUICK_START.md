# 🚀 PromptEngine - Quick Start Guide

## What is PromptEngine?

PromptEngine is an AI-powered application that transforms simple ideas into professional, optimized prompts for Large Language Models. It helps you create, test, and manage prompts with ease.

## ⚡ Instant Setup (5 Minutes)

### 1. Prerequisites
- **Node.js** (16+): [Download here](https://nodejs.org/)
- **Google Gemini API Key**: [Get one here](https://aistudio.google.com/app/apikey)

### 2. Quick Start Scripts

**Windows Users:**
```cmd
double-click start-dev.bat
```

**Mac/Linux Users:**
```bash
./start-dev.sh
```

**Manual Setup:**
```bash
npm install
# Edit .env.local with your API key
npm run dev
```

### 3. Open Your Browser
Go to: **http://localhost:3000**

## 🎯 How to Use PromptEngine

1. **Enter Your Idea**: Describe what you want to accomplish
2. **Add Context**: Upload files if needed (documents, images, etc.)
3. **Generate**: Click "Generate Optimized Prompt"
4. **Review**: See the structured prompt with persona, task, constraints
5. **Test**: Click "Test Prompt" to see how it performs
6. **Save**: Rate and save prompts to your history

## 📋 Complete Documentation

- **[LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md)** - Detailed setup instructions
- **[PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md)** - Complete project analysis
- **[Original README](README.md)** - Original project information

## 🔧 Configuration

**Required Environment Variable:**
```bash
GEMINI_API_KEY=your_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🆘 Troubleshooting

**Common Issues:**
- **"API key error"**: Check your `.env.local` file has the correct key
- **"Port in use"**: Change port with `npm run dev -- --port 3001`
- **"Dependencies missing"**: Run `npm install`

## 📁 Project Structure
```
Prompt-Engine/
├── App.tsx                    # Main app component
├── services/geminiService.ts  # AI integration
├── components/                # React components
├── hooks/                     # Custom hooks
├── start-dev.sh/.bat          # Quick start scripts
├── .env.local                 # Your API key (create this)
└── docs/                      # Documentation
```

## 🌟 Features

- **AI-Powered**: Uses Google Gemini for intelligent prompt generation
- **File Support**: Upload documents and images as context
- **Prompt Testing**: Test prompts against real AI models
- **History Management**: Save, rate, and organize your prompts
- **Dark/Light Themes**: Customizable interface
- **Responsive**: Works on desktop, tablet, and mobile

## 🛠 Development

**Available Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Tech Stack:**
- React 19.2.0 + TypeScript
- Vite 6.2.0 (fast dev server)
- TailwindCSS (styling)
- Google Gemini AI

---

**Ready to go!** Your AI-powered prompt optimization studio is ready to help you create better prompts. 🚀