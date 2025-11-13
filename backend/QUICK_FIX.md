# Quick Setup and Fix Guide

## Current Issue: Missing Dependencies

The error "uvicorn is not recognized" means the Python packages haven't been installed yet.

## ✅ QUICK FIX:

### Step 1: Install Dependencies
```bash
# Make sure you're in the backend directory
cd Prompt-Engine\backend

# Install all required packages
pip install -r requirements.txt
```

### Step 2: Configure Environment
```bash
# Copy the environment template
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Step 3: Setup Database (Skip for now - you can test without MySQL)
```bash
# Optional: Skip database setup for testing
# python database_setup.py
```

### Step 4: Start the Server
```bash
# Method 1: Using Python directly (recommended for testing)
python main.py

# Method 2: Using uvicorn (after installing dependencies)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 🛠️ Alternative: Run with Fallback Mode

I've included fallback responses in the code so you can test without a real Gemini API key:

```bash
python main.py
```

The server will start and provide demo responses even without the API key configured.

## 📋 Expected Installation Output:
You should see packages being installed like:
- fastapi
- uvicorn
- sqlalchemy
- pymysql
- requests
- python-dotenv
- etc.

## 🔧 If pip install fails:

### Try using python -m pip:
```bash
python -m pip install -r requirements.txt
```

### Or create virtual environment first:
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## ✅ Success Indicators:

When working correctly, you should see:
```
INFO: Application startup completed
INFO: Prompt Engine API started successfully
INFO:     Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## 🧪 Test the API:

Once running, test with:
```bash
curl http://localhost:8000/api/health
```

This should return: `{"status": "healthy", "service": "Prompt Engine API"}`