@echo off
title Fix Backend Dependencies
color 0C

echo ================================================================
echo              FIXING BACKEND DEPENDENCIES
echo ================================================================
echo.
echo Installing FastAPI and required packages...
echo.

cd backend

REM Install all required packages
python -m pip install fastapi uvicorn sqlalchemy python-dotenv requests python-multipart pydantic

echo.
echo ================================================================
echo                    TESTING INSTALLATION
echo ================================================================
echo.

REM Test if FastAPI can be imported
python -c "import fastapi; print('✅ FastAPI installed successfully!')" 2>nul
if %errorlevel% neq 0 (
    echo ❌ FastAPI installation failed
    echo Trying alternative installation method...
    pip install fastapi uvicorn sqlalchemy python-dotenv requests python-multipart pydantic
)

echo.
echo ================================================================
echo                    STARTING BACKEND
echo ================================================================
echo.

echo Starting PromptEngine Backend Server...
echo Backend will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python main.py

pause
