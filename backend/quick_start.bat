@echo off
echo ========================================
echo PROMPT ENGINE BACKEND - ONE CLICK SETUP
echo ========================================
echo.

echo Installing dependencies...
python -m pip install fastapi uvicorn sqlalchemy pymysql pydantic python-multipart python-dotenv requests

echo.
echo Starting server...
echo The backend will be available at: http://localhost:8000
echo API docs at: http://localhost:8000/api/docs
echo.
echo Starting now...
python main.py