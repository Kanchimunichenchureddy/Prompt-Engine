-- MySQL Database Schema for Prompt Engine
-- Create database and tables

CREATE DATABASE IF NOT EXISTS prompt_engine 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE prompt_engine;

-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
    id VARCHAR(36) PRIMARY KEY,
    original_idea TEXT NOT NULL,
    generated_prompt_json MEDIUMTEXT NOT NULL,
    generated_prompt_text TEXT NOT NULL,
    rating INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    context_files JSON NULL
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prompt_id VARCHAR(36) NOT NULL,
    test_input TEXT NOT NULL,
    test_output MEDIUMTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_prompts_created_at ON prompts(created_at);
CREATE INDEX idx_prompts_rating ON prompts(rating);
CREATE INDEX idx_test_results_prompt_id ON test_results(prompt_id);
CREATE INDEX idx_file_uploads_upload_date ON file_uploads(upload_date);

-- Insert sample data
INSERT IGNORE INTO prompts (
    id, 
    original_idea, 
    generated_prompt_json, 
    generated_prompt_text, 
    rating
) VALUES (
    UUID(),
    'A function that calculates Fibonacci sequence',
    '{"persona": "You are a Python expert and algorithm specialist", "task": "Create a Python function that calculates the Fibonacci sequence efficiently", "constraints": ["Use recursion or iteration based on performance", "Include time complexity analysis", "Handle edge cases properly"], "format": "Provide code with comments and explanation", "examples": ["fibonacci(5) should return [0, 1, 1, 2, 3]", "fibonacci(10) should return [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]"]}',
    '**Persona:**\nYou are a Python expert and algorithm specialist\n\n**Task:**\nCreate a Python function that calculates the Fibonacci sequence efficiently\n\n**Constraints:**\n- Use recursion or iteration based on performance\n- Include time complexity analysis\n- Handle edge cases properly\n\n**Output Format:**\nProvide code with comments and explanation\n\n**Examples:**\n- fibonacci(5) should return [0, 1, 1, 2, 3]\n- fibonacci(10) should return [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n',
    1
);

SELECT 'Database setup completed successfully!' AS message;