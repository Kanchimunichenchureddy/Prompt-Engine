@echo off
title Complete PromptEngine Setup
color 0B

echo ================================================================
echo              COMPLETE PROMPTENGINE SETUP
echo ================================================================
echo.
echo This script will:
echo 1. Test backend dependencies
echo 2. Start backend server on port 8000
echo 3. Start frontend on port 3000
echo.

REM Check if we're in the right directory
if not exist "backend\main.py" (
    echo Error: Please run this script from the PromptEngine directory
    pause
    exit /b 1
)

echo [Step 1] Testing Python and FastAPI...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python not found
    pause
    exit /b 1
)

python -c "import fastapi" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing FastAPI and dependencies...
    python -m pip install fastapi uvicorn sqlalchemy python-dotenv requests python-multipart pydantic
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo [Step 2] Starting Backend Server...
echo Backend URL: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.

REM Start backend in a new window
start "PromptEngine Backend" cmd /k "cd backend && python main.py"

echo [Step 3] Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo [Step 4] Starting Frontend...
echo Frontend URL: http://localhost:3000
echo.

REM Check if npm exists
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Warning: npm not found. Frontend won't start automatically.
    echo Please manually run 'npm install' and 'npm run dev' in a new terminal
) else (
    REM Install frontend dependencies if needed
    if not exist "node_modules" (
        echo Installing frontend dependencies...
        npm install
    )
    
    REM Start frontend in a new window
    start "PromptEngine Frontend" cmd /k "npm run dev"
)

echo.
echo ================================================================
echo                   SETUP COMPLETE!
echo ================================================================
echo.
echo ✅ Backend: http://localhost:8000
echo ✅ Frontend: http://localhost:3000 (if npm available)
echo ✅ API Documentation: http://localhost:8000/docs
echo.
echo If browsers don't open automatically:
echo 1. Manually open: http://localhost:3000
echo 2. Test API: http://localhost:8000/api/health
echo.
echo Press any key to exit this setup script...
pause >nul
