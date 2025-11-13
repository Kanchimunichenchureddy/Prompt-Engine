@echo off
echo ========================================
echo Prompt Engine Backend Setup & Startup
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

echo Python found - version:
python --version

echo.
echo Step 1: Creating virtual environment...
if not exist venv (
    python -m venv venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)

echo.
echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Step 3: Installing/updating dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Trying alternative method...
    python -m pip install -r requirements.txt
)

echo.
echo Step 4: Starting FastAPI server...
echo Server will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/api/docs
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
python main.py

echo.
echo Server has stopped.
pause