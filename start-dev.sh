#!/bin/bash

# PromptEngine Development Server Startup Script
# This script sets up and starts the development server

echo "🚀 Starting PromptEngine Development Server"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found. Creating from template..."
    cp .env.local.example .env.local 2>/dev/null || {
        echo "📝 Please create .env.local file with your GEMINI_API_KEY"
        echo "Example: echo 'GEMINI_API_KEY=your_api_key_here' > .env.local"
        exit 1
    }
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if API key is configured
if grep -q "your_gemini_api_key_here" .env.local; then
    echo "⚠️  Please configure your GEMINI_API_KEY in .env.local"
    echo "Get your API key from: https://aistudio.google.com/app/apikey"
    exit 1
fi

echo "✅ All checks passed!"
echo ""
echo "🌟 Starting development server..."
echo "📍 App will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev