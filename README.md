# 🎯 PromptEngine - AI-Powered Prompt Optimization Platform

A comprehensive full-stack web application that transforms your ideas into optimized AI prompts using Google's Gemini AI.

## 📋 **Project Structure**

```
Prompt-Engine/
├── frontend/                 # React frontend application
│   ├── src/                 # React source code
│   ├── package.json         # Frontend dependencies
│   └── index.html           # Main HTML file
├── backend/                 # FastAPI backend application
│   ├── main.py             # FastAPI server
│   ├── requirements.txt    # Backend dependencies
│   └── .env                # Environment configuration
├── start-full-stack.bat    # One-click full stack launcher
├── start-backend.bat       # Backend-only launcher
└── README.md              # This file
```

## 🚀 **Quick Start (Recommended)**

### **Option 1: Full Stack (Frontend + Backend)**
Double-click: `start-full-stack.bat`

### **Option 2: Backend Only**
Double-click: `start-backend.bat`

## 📁 **Frontend (React)**

### **Features**
- 🎨 Modern React 19 with TypeScript
- 🌙 Dark/Light theme support
- 📱 Responsive design
- ⚡ Hot reload development
- 🎭 Tailwind CSS styling

### **Running Frontend**
```bash
cd Prompt-Engine
npm install
npm run dev
```

**Access**: http://localhost:3000

### **Frontend Dependencies**
- React 19.2
- TypeScript 5.8
- Vite 6.2
- Tailwind CSS 3.4
- Google Generative AI

## 📡 **Backend (FastAPI)**

### **Features**
- ⚡ FastAPI with Python 3.13
- 📊 SQLite/MySQL database support
- 🤖 Google Gemini AI integration
- 📁 File upload handling
- 📖 Auto-generated API documentation
- 🔄 CORS middleware for React

### **Running Backend**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Access**: http://localhost:8000
**API Docs**: http://localhost:8000/docs

### **Backend Dependencies**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
python-dotenv==1.0.0
requests==2.31.0
```

## 🔧 **Configuration**

### **Environment Variables**
Create `.env` file in `backend/` directory:

```env
# Gemini API Key (Required)
GEMINI_API_KEY=your_google_gemini_api_key_here

# Database Configuration
DATABASE_URL=sqlite:///./prompt_engine.db

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS Settings
ALLOWED_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]
```

### **Getting Gemini API Key**
1. Visit: https://aistudio.google.com/app/apikey
2. Create a new API key
3. Add it to your `.env` file

## 🎨 **Frontend Components**

### **Core Features**
- **PromptForm**: User input interface
- **PromptResult**: Generated prompt display
- **HistoryPanel**: Prompt management
- **FileUpload**: Context file handling
- **ThemeSwitcher**: Dark/light mode

### **API Integration**
The frontend connects to the backend at `http://localhost:8000` for:
- Prompt generation (`POST /api/generate`)
- Prompt testing (`POST /api/test`)
- History management (`GET /api/prompts`)
- File uploads (`POST /api/upload`)

## 🗄️ **Backend API Endpoints**

### **Core APIs**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/health` | GET | API status |
| `/api/generate` | POST | Generate optimized prompt |
| `/api/test` | POST | Test prompt with AI |
| `/api/prompts` | GET | Get prompt history |
| `/api/prompts/{id}/rate` | POST | Rate prompt |
| `/api/upload` | POST | Upload context files |
| `/api/stats` | GET | Application statistics |

### **AI Service**
- **Gemini 1.5 Pro**: For prompt generation
- **Gemini 1.5 Flash**: For prompt testing
- **Fallback responses**: When API key unavailable

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Kill existing processes
taskkill /F /IM node.exe
taskkill /F /IM python.exe

# Or change ports:
# Frontend: npm run dev -- --port 3001
# Backend: Edit main.py port parameter
```

#### **Dependencies Issues**
```bash
# Clean install
rm -rf node_modules
rm -rf venv
npm install
pip install -r backend/requirements.txt
```

#### **CORS Errors**
- Ensure backend is running on port 8000
- Check `ALLOWED_ORIGINS` in `.env`
- Verify frontend connects to `http://localhost:8000`

#### **Database Issues**
- SQLite automatically created if MySQL unavailable
- Database file: `backend/prompt_engine.db`
- Tables auto-created on startup

### **Windows-Specific Solutions**

#### **Python Not Found**
```bash
# Check Python installation
python --version
python3 --version

# If missing, download from python.org
```

#### **Permission Errors**
```bash
# Run Command Prompt as Administrator
# Or install packages with --user flag
pip install --user package_name
npm install --prefix ~/
```

## 📊 **Database Schema**

### **Tables**
- **prompts**: Generated prompts storage
- **test_results**: Prompt testing history
- **file_uploads**: File metadata

### **Relationships**
- One prompt can have multiple test results
- File uploads linked to prompts

## 🔍 **Development**

### **Frontend Development**
```bash
cd Prompt-Engine
npm install
npm run dev
# Hot reload at http://localhost:3000
```

### **Backend Development**
```bash
cd backend
pip install -r requirements.txt
python main.py
# API docs at http://localhost:8000/docs
```

### **Debugging**
- Frontend: Browser DevTools (F12)
- Backend: Console logs and `/api/health` endpoint
- Database: Auto-created SQLite file

## 🚀 **Production Deployment**

### **Frontend Build**
```bash
cd Prompt-Engine
npm run build
# Deploy 'dist' folder to static hosting
```

### **Backend Deployment**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### **Environment Setup**
- Set production `GEMINI_API_KEY`
- Configure production database
- Set appropriate CORS origins
- Use environment-specific configuration

## 📝 **License**

MIT License - see LICENSE file for details

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test both frontend and backend
5. Submit pull request

## 🆘 **Support**

For issues:
1. Check troubleshooting section
2. Verify API key configuration
3. Ensure ports 3000 and 8000 are available
4. Check console logs for errors

---

**Built with ❤️ using React, FastAPI, and Google Gemini AI**
