@echo off
title PromptEngine Full Stack Launcher
color 0B

echo ================================================================
echo              PROMPTENGINE FULL STACK LAUNCHER
echo ================================================================
echo.
echo Starting both Frontend (React) and Backend (FastAPI)...
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop both servers
echo ================================================================
echo.

REM Start backend in a new window
echo [1/2] Starting Backend Server...
start "PromptEngine Backend" cmd /k "cd backend && python main.py"

REM Wait a moment for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend
echo [2/2] Starting Frontend Server...
start "PromptEngine Frontend" cmd /k "npm run dev"

echo.
echo ================================================================
echo                   SERVERS STARTING...
echo ================================================================
echo.
echo ✅ Backend: http://localhost:8000
echo ✅ Frontend: http://localhost:3000
echo.
echo If browsers don't open automatically:
echo - Manual access: http://localhost:3000
echo - API docs: http://localhost:8000/docs
echo.
echo Press any key to exit this launcher...
pause >nul