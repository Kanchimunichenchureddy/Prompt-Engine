@echo off
REM PromptEngine Development Server Startup Script for Windows
REM This script sets up and starts the development server

echo 🚀 Starting PromptEngine Development Server
echo ==========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  .env.local file not found.
    echo 📝 Please create .env.local file with your GEMINI_API_KEY
    echo Example: echo GEMINI_API_KEY=your_api_key_here ^> .env.local
    echo.
    echo Get your API key from: https://aistudio.google.com/app/apikey
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Check if API key is configured
findstr /C:"your_gemini_api_key_here" .env.local >nul
if not errorlevel 1 (
    echo ⚠️  Please configure your GEMINI_API_KEY in .env.local
    echo Get your API key from: https://aistudio.google.com/app/apikey
    pause
    exit /b 1
)

echo ✅ All checks passed!
echo.
echo 🌟 Starting development server...
echo 📍 App will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev