@echo off
echo ========================================
echo FASTAPI BACKEND - ZERO CONFIG START
echo ========================================
echo.

echo Starting FastAPI backend...
echo Backend will be available at: http://localhost:3004
echo API Documentation: http://localhost:3004/docs
echo.
echo Press Ctrl+C to stop
echo.

cd /d "C:\Users\teja.kanchi\realworldprojects\PromptEngin2\Prompt-Engine\backend"

REM Try Python directly (will use global packages if venv doesn't work)
python -c "
import sys
import os
sys.path.insert(0, '.')

try:
    from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
    from fastapi.middleware.cors import CORSMiddleware
    import uvicorn
    import json
    import uuid
    from datetime import datetime
    from typing import List, Optional, Dict, Any
    import logging
    import os
    from dotenv import load_dotenv
    
    print('All imports successful! Starting server...')
    
    # Load environment variables
    load_dotenv()
    
    # Setup basic logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    # FastAPI app initialization
    app = FastAPI(
        title="Prompt Engine API",
        description="Backend API for Prompt Engine",
        version="1.0.0",
        docs_url="/docs"
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[\"http://localhost:3000\", \"http://127.0.0.1:3000\", \"http://localhost:5173\", \"http://127.0.0.1:5173\"],
        allow_credentials=True,
        allow_methods=[\"*\"],
        allow_headers=[\"*\"],
    )
    
    # In-memory storage for demo
    prompts_store = []
    
    @app.get(\"/\")
    async def root():
        return {\"message\": \"Prompt Engine API\", \"version\": \"1.0.0\", \"docs\": \"/docs\"}
    
    @app.get(\"/api/health\")
    async def health_check():
        return {\"status\": \"healthy\", \"service\": \"Prompt Engine API\"}
    
    @app.post(\"/api/generate\")
    async def generate_prompt(request: dict):
        idea = request.get('idea', '')
        if not idea.strip():
            return {\"error\": \"Idea cannot be empty\"}
        
        # Generate demo response
        demo_prompt = {
            \"id\": str(uuid.uuid4()),
            \"original_idea\": idea,
            \"generated_prompt\": {
                \"persona\": \"You are an expert assistant specializing in software development\",
                \"task\": f\"Help with: {idea}\",
                \"constraints\": [\"Be clear and concise\", \"Provide practical examples\"],
                \"format\": \"Provide a step-by-step solution with code examples\",
                \"examples\": [\"Include error handling\", \"Add comments to code\"]
            },
            \"generated_prompt_text\": f\"**Persona:**\\nYou are an expert assistant specializing in software development\\n\\n**Task:**\\nHelp with: {idea}\\n\\n**Constraints:**\\n- Be clear and concise\\n- Provide practical examples\\n\\n**Output Format:**\\nProvide a step-by-step solution with code examples\\n\\n**Examples:**\\n- Include error handling\\n- Add comments to code\",
            \"rating\": 0,
            \"created_at\": datetime.utcnow().isoformat(),
            \"context_files\": None
        }
        
        # Store in memory
        prompts_store.append(demo_prompt)
        return demo_prompt
    
    @app.post(\"/api/test\")
    async def test_prompt_endpoint(request: dict):
        prompt = request.get('prompt', '')
        if not prompt.strip():
            return {\"error\": \"Prompt cannot be empty\"}
        
        return {\"test_result\": f\"Demo test response for: {prompt[:100]}... In a real implementation, this would be processed by the AI model.\"}
    
    @app.get(\"/api/prompts\")
    async def get_prompts():
        return prompts_store
    
    @app.get(\"/api/stats\")
    async def get_stats():
        return {
            \"total_prompts\": len(prompts_store),
            \"average_rating\": 0,
            \"total_files\": 0,
            \"prompts_this_week\": len(prompts_store)
        }
    
    print('Starting uvicorn server...')
    uvicorn.run(app, host=\"0.0.0.0\", port=3004, log_level=\"info\")
    
except ImportError as e:
    print(f'Import error: {e}')
    print('Please install required packages: pip install fastapi uvicorn python-multipart python-dotenv')
except Exception as e:
    print(f'Startup error: {e}')
    print('An error occurred during startup.')

" && pause