@echo off
echo Starting Prompt Engine Backend...
echo.

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Setup database
echo Setting up database...
python database_setup.py

REM Start the application
echo Starting FastAPI server...
python main.py

pause