"""
Database initialization script for Prompt Engine
Creates the database and tables
"""

import sys
import os

# Add the parent directory to the path to import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import SessionLocal
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_database():
    """Create the database if it doesn't exist"""
    # Create connection without database name
    base_url = os.getenv("DATABASE_URL", "mysql+pymysql://root:tejadot12345@localhost:3306/prompt_engine")
    
    # Extract the base connection details
    db_name = "prompt_engine"
    base_connection = base_url.replace("/prompt_engine", "")
    
    engine = create_engine(base_connection)
    
    try:
        with engine.connect() as connection:
            # Create database
            connection.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
            print(f"Database '{db_name}' created or already exists.")
            
    except Exception as e:
        print(f"Error creating database: {e}")
        return False
    
    return True

def create_tables():
    """Create all database tables"""
    from main import Base, create_tables
    
    try:
        create_tables()
        print("Database tables created successfully.")
        return True
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False

def setup_sample_data():
    """Add sample data for testing"""
    from main import SessionLocal, Prompt
    
    db = SessionLocal()
    try:
        # Add sample prompts if table is empty
        count = db.query(Prompt).count()
        if count == 0:
            sample_prompts = [
                {
                    "original_idea": "A function that calculates Fibonacci sequence",
                    "generated_prompt_json": '{"persona": "You are a Python expert and algorithm specialist", "task": "Create a Python function that calculates the Fibonacci sequence efficiently", "constraints": ["Use recursion or iteration based on performance", "Include time complexity analysis", "Handle edge cases properly"], "format": "Provide code with comments and explanation", "examples": ["fibonacci(5) should return [0, 1, 1, 2, 3]", "fibonacci(10) should return [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]"]}',
                    "generated_prompt_text": "**Persona:**\nYou are a Python expert and algorithm specialist\n\n**Task:**\nCreate a Python function that calculates the Fibonacci sequence efficiently\n\n**Constraints:**\n- Use recursion or iteration based on performance\n- Include time complexity analysis\n- Handle edge cases properly\n\n**Output Format:**\nProvide code with comments and explanation\n\n**Examples:**\n- fibonacci(5) should return [0, 1, 1, 2, 3]\n- fibonacci(10) should return [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n",
                    "rating": 1
                }
            ]
            
            for prompt_data in sample_prompts:
                prompt = Prompt(**prompt_data)
                db.add(prompt)
            
            db.commit()
            print("Sample data added successfully.")
    except Exception as e:
        print(f"Error adding sample data: {e}")
    finally:
        db.close()

def main():
    """Main setup function"""
    print("Setting up Prompt Engine database...")
    
    # Create database
    if not create_database():
        print("Failed to create database. Exiting.")
        return
    
    # Create tables
    if not create_tables():
        print("Failed to create tables. Exiting.")
        return
    
    # Add sample data
    setup_sample_data()
    
    print("Database setup completed successfully!")

if __name__ == "__main__":
    main()