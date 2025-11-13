@echo off
title PromptEngine Backend Only
color 0A

echo ================================================================
echo                    PROMPTENGINE BACKEND LAUNCHER
echo ================================================================
echo.
echo Starting FastAPI Backend Server...
echo.
echo Backend API will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ================================================================
echo.

cd backend
python main.py

pause