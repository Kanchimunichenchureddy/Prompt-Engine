"""
FastAPI Backend for Prompt Engine
A backend API that provides prompt generation, testing, and management capabilities
"""

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime
from typing import List, Optional, Dict, Any
import os
import logging
import base64
import uuid
import json
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration with SQLite fallback
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL or "localhost" in DATABASE_URL:
    # Use SQLite for testing when MySQL is not available
    DATABASE_URL = "sqlite:///./prompt_engine.db"
    engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})
    print("Using SQLite database for testing (MySQL not available)")
else:
    engine = create_engine(DATABASE_URL, pool_recycle=300)
    print(f"Using MySQL database: {DATABASE_URL}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI app initialization
app = FastAPI(
    title="Prompt Engine API",
    description="Backend API for Prompt Engine - AI-powered prompt optimization tool",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Models
class Prompt(Base):
    __tablename__ = "prompts"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    original_idea = Column(Text, nullable=False)
    generated_prompt_json = Column(Text, nullable=False)  # JSON string of StructuredPromptContent
    generated_prompt_text = Column(Text, nullable=False)
    rating = Column(Integer, default=0)  # 0=None, 1=Up, 2=Down
    created_at = Column(DateTime, default=datetime.utcnow)
    context_files = Column(JSON)  # List of context files metadata

class TestResult(Base):
    __tablename__ = "test_results"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    prompt_id = Column(String(36), ForeignKey("prompts.id"), nullable=False)
    test_input = Column(Text, nullable=False)
    test_output = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class FileUpload(Base):
    __tablename__ = "file_uploads"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_path = Column(String(500), nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class PromptRequest(BaseModel):
    idea: str
    files: Optional[List[Dict[str, Any]]] = None

class StructuredPromptContent(BaseModel):
    persona: Optional[str] = None
    task: str
    constraints: Optional[List[str]] = None
    format: Optional[str] = None
    examples: Optional[List[str]] = None

class PromptResponse(BaseModel):
    id: str
    original_idea: str
    generated_prompt: StructuredPromptContent
    generated_prompt_text: str
    rating: int
    created_at: datetime
    context_files: Optional[List[Dict[str, Any]]] = None

class TestRequest(BaseModel):
    prompt: str

class TestResponse(BaseModel):
    test_result: str

class PromptRatingUpdate(BaseModel):
    rating: int  # 0=None, 1=Up, 2=Down

# AI Integration (using requests to call Gemini API directly)
import requests

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.has_api_key = bool(self.api_key)
        if not self.has_api_key:
            print("WARNING: GEMINI_API_KEY not found. Using demo responses.")
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models"
    
    async def generate_optimized_prompt(self, idea: str, files: Optional[List[Dict]] = None) -> Dict[str, Any]:
        """Generate optimized prompt using Gemini API"""
        try:
            if self.has_api_key:
                # Create the system instruction
                system_instruction = """You are a world-class AI prompt engineer. Your task is to take a user's simple idea and transform it into a highly effective, detailed, and optimized prompt for a large language model.

Guidelines:
1. **Clarity and Specificity:** The prompt must be unambiguous and provide specific instructions.
2. **Context:** Consider any provided context from files.
3. **Persona:** Define a persona for the AI.
4. **Format:** Specify the desired output format.
5. **Constraints:** Add constraints or restrictions.
6. **Examples:** Provide examples if applicable.

Return a JSON object with this structure:
{
  "persona": "The persona the AI should adopt",
  "task": "The primary task for the AI to perform",
  "constraints": ["List", "of", "rules", "or", "restrictions"],
  "format": "The desired output format",
  "examples": ["Example", "of", "desired", "input/output"]
}"""
                
                content = f"{system_instruction}\n\nUser idea: \"{idea}\""
                if files:
                    content += "\n\nContext files: "
                    for file_info in files:
                        content += f" - {file_info.get('name', 'Unknown file')}"
                
                # Call Gemini API
                response = requests.post(
                    f"{self.api_url}/gemini-1.5-pro:generateContent",
                    params={"key": self.api_key},
                    json={
                        "contents": [{
                            "parts": [{"text": content}]
                        }],
                        "generationConfig": {
                            "temperature": 0.1,
                            "topK": 40,
                            "topP": 0.8,
                            "maxOutputTokens": 2048,
                        }
                    }
                )
                
                if response.status_code != 200:
                    raise Exception(f"Gemini API error: {response.status_code}")
                
                result = response.json()
                structured_prompt = result["candidates"][0]["content"]["parts"][0]["text"]
                
                # Clean up the response to extract JSON
                structured_prompt = self._extract_json(structured_prompt)
            else:
                # Fallback response for demo purposes
                fallback = {
                    "persona": "You are an expert assistant specializing in software development",
                    "task": f"Help with: {idea}",
                    "constraints": ["Be clear and concise", "Provide practical examples"],
                    "format": "Provide a step-by-step solution with code examples",
                    "examples": ["Include error handling", "Add comments to code"]
                }
                structured_prompt = json.dumps(fallback)
            
            return {"structured_prompt": structured_prompt, "full_prompt_text": self._format_prompt_text(structured_prompt)}
            
        except Exception as e:
            logger.error(f"Error generating prompt: {str(e)}")
            # Fallback response for demo purposes
            fallback = {
                "persona": "You are an expert assistant specializing in software development",
                "task": f"Help with: {idea}",
                "constraints": ["Be clear and concise", "Provide practical examples"],
                "format": "Provide a step-by-step solution with code examples",
                "examples": ["Include error handling", "Add comments to code"]
            }
            fallback_json = json.dumps(fallback)
            return {"structured_prompt": fallback_json, "full_prompt_text": self._format_prompt_text(fallback_json)}
    
    async def test_prompt(self, prompt: str) -> str:
        """Test prompt using Gemini Flash"""
        try:
            if self.has_api_key:
                response = requests.post(
                    f"{self.api_url}/gemini-1.5-flash:generateContent",
                    params={"key": self.api_key},
                    json={
                        "contents": [{
                            "parts": [{"text": prompt}]
                        }],
                        "generationConfig": {
                            "temperature": 0.7,
                            "topK": 40,
                            "topP": 0.8,
                            "maxOutputTokens": 1024,
                        }
                    }
                )
                
                if response.status_code != 200:
                    raise Exception(f"Gemini API error: {response.status_code}")
                
                result = response.json()
                return result["candidates"][0]["content"]["parts"][0]["text"].strip()
            else:
                # Fallback response for demo
                return f"This is a demo response for the prompt: {prompt[:100]}... In a real implementation, this would be processed by the AI model to provide a detailed response based on the instructions given."
            
        except Exception as e:
            logger.error(f"Error testing prompt: {str(e)}")
            # Fallback response for demo
            return f"This is a test response for the prompt: {prompt[:100]}... The AI model would typically process this prompt and provide a detailed response based on the instructions given."
    
    def _extract_json(self, text: str) -> str:
        """Extract JSON from response text"""
        import re
        # Look for JSON content in the response
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json_match.group()
        else:
            # Return a default structured prompt if no JSON found
            return json.dumps({
                "persona": "You are a helpful AI assistant",
                "task": text[:200] if text else "Complete the given task",
                "constraints": ["Be helpful and accurate"],
                "format": "Provide a clear, well-structured response",
                "examples": ["Include relevant examples"]
            })
    
    def _format_prompt_text(self, structured_prompt: str) -> str:
        """Format structured prompt into readable text"""
        try:
            data = json.loads(structured_prompt)
            formatted_text = ""
            
            if data.get("persona"):
                formatted_text += f"**Persona:**\n{data['persona']}\n\n"
            if data.get("task"):
                formatted_text += f"**Task:**\n{data['task']}\n\n"
            if data.get("constraints"):
                formatted_text += f"**Constraints:**\n- {chr(10).join(data['constraints'])}\n\n"
            if data.get("format"):
                formatted_text += f"**Output Format:**\n{data['format']}\n\n"
            if data.get("examples"):
                formatted_text += f"**Examples:**\n- {chr(10).join(data['examples'])}\n\n"
            
            return formatted_text.strip()
        except Exception as e:
            logger.error(f"Error formatting prompt text: {e}")
            return structured_prompt

# Initialize AI service
ai_service = AIService()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility functions
# import uuid - already imported at the top

def create_tables():
    Base.metadata.create_all(bind=engine)

# API Routes

@app.on_event("startup")
async def startup_event():
    try:
        create_tables()
        logger.info("Prompt Engine API started successfully with database")
    except Exception as e:
        logger.error(f"Startup error: {e}")
        # Continue startup even if database setup fails
        logger.info("Continuing startup without database setup (using demo mode)")

@app.get("/")
async def root():
    return {"message": "Prompt Engine API", "version": "1.0.0", "docs": "/docs"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Prompt Engine API"}

# Prompt Generation Endpoint
@app.post("/api/generate", response_model=PromptResponse)
async def generate_prompt(request: PromptRequest, db: Session = Depends(get_db)):
    """Generate optimized prompt from user idea"""
    try:
        if not request.idea.strip():
            raise HTTPException(status_code=400, detail="Idea cannot be empty")
        
        # Generate prompt using AI
        result = await ai_service.generate_optimized_prompt(request.idea, request.files)
        structured_prompt = json.loads(result["structured_prompt"])
        
        # Save to database
        prompt = Prompt(
            original_idea=request.idea,
            generated_prompt_json=json.dumps(structured_prompt),
            generated_prompt_text=result["full_prompt_text"],
            context_files=request.files
        )
        
        db.add(prompt)
        db.commit()
        db.refresh(prompt)
        
        # Convert to response format
        response = PromptResponse(
            id=prompt.id,
            original_idea=prompt.original_idea,
            generated_prompt=structured_prompt,
            generated_prompt_text=prompt.generated_prompt_text,
            rating=prompt.rating,
            created_at=prompt.created_at,
            context_files=prompt.context_files
        )
        
        return response
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        logger.error(f"Error in generate_prompt: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Prompt Testing Endpoint
@app.post("/api/test", response_model=TestResponse)
async def test_prompt_endpoint(request: TestRequest):
    """Test prompt against AI model"""
    try:
        if not request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")
        
        result = await ai_service.test_prompt(request.prompt)
        return TestResponse(test_result=result)
        
    except Exception as e:
        logger.error(f"Error in test_prompt: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Prompt History Endpoints
@app.get("/api/prompts", response_model=List[PromptResponse])
async def get_prompts(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    rating: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get prompt history with optional filtering"""
    try:
        query = db.query(Prompt)
        
        # Apply filters
        if search:
            query = query.filter(Prompt.original_idea.contains(search))
        if rating is not None:
            query = query.filter(Prompt.rating == rating)
        
        prompts = query.order_by(Prompt.created_at.desc()).offset(skip).limit(limit).all()
        
        results = []
        for prompt in prompts:
            structured_prompt = json.loads(prompt.generated_prompt_json)
            response = PromptResponse(
                id=prompt.id,
                original_idea=prompt.original_idea,
                generated_prompt=structured_prompt,
                generated_prompt_text=prompt.generated_prompt_text,
                rating=prompt.rating,
                created_at=prompt.created_at,
                context_files=prompt.context_files
            )
            results.append(response)
        
        return results
        
    except Exception as e:
        logger.error(f"Error in get_prompts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/prompts/{prompt_id}/rate")
async def rate_prompt(prompt_id: str, rating_update: PromptRatingUpdate, db: Session = Depends(get_db)):
    """Update prompt rating"""
    try:
        prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
        if not prompt:
            raise HTTPException(status_code=404, detail="Prompt not found")
        
        prompt.rating = rating_update.rating
        db.commit()
        
        return {"message": "Rating updated successfully", "prompt_id": prompt_id, "rating": prompt.rating}
        
    except Exception as e:
        logger.error(f"Error in rate_prompt: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/prompts/{prompt_id}")
async def delete_prompt(prompt_id: str, db: Session = Depends(get_db)):
    """Delete prompt from history"""
    try:
        prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
        if not prompt:
            raise HTTPException(status_code=404, detail="Prompt not found")
        
        db.delete(prompt)
        db.commit()
        
        return {"message": "Prompt deleted successfully", "prompt_id": prompt_id}
        
    except Exception as e:
        logger.error(f"Error in delete_prompt: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# File Upload Endpoint
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload and store file"""
    try:
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(os.getcwd(), "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Store metadata in database
        file_record = FileUpload(
            filename=unique_filename,
            original_name=file.filename,
            file_type=file.content_type or "application/octet-stream",
            file_size=len(content),
            file_path=file_path
        )
        
        db.add(file_record)
        db.commit()
        db.refresh(file_record)
        
        return {
            "id": file_record.id,
            "filename": file_record.original_name,
            "type": file_record.file_type,
            "size": file_record.file_size,
            "upload_date": file_record.upload_date.isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in upload_file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

# Statistics Endpoint
@app.get("/api/stats")
async def get_stats(db: Session = Depends(get_db)):
    """Get application statistics"""
    try:
        total_prompts = db.query(Prompt).count()
        avg_rating = db.query(Prompt).filter(Prompt.rating > 0).with_entities(Prompt.rating).all()
        total_files = db.query(FileUpload).count()
        
        avg_rating_value = sum([rating[0] for rating in avg_rating]) / len(avg_rating) if avg_rating else 0
        
        return {
            "total_prompts": total_prompts,
            "average_rating": round(avg_rating_value, 2),
            "total_files": total_files,
            "prompts_this_week": db.query(Prompt).filter(
                Prompt.created_at >= datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
            ).count()
        }
        
    except Exception as e:
        logger.error(f"Error in get_stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)