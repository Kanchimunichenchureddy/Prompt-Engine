
import { StructuredPromptContent } from "../types";

// Backend API base URL
const API_BASE_URL = 'http://localhost:8000';

export const generateOptimizedPrompt = async (idea: string, files: File[]): Promise<{ structuredPrompt: StructuredPromptContent, fullPromptText: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: idea,
        files: files.length > 0 ? files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        })) : null
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      structuredPrompt: data.generated_prompt,
      fullPromptText: data.generated_prompt_text
    };

  } catch (error) {
    console.error("Error generating optimized prompt:", error);
    throw new Error("Failed to generate prompt. Please check if the backend server is running on port 8000.");
  }
};

export const testPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.test_result;
    
  } catch (error) {
    console.error("Error testing prompt:", error);
    throw new Error("Failed to test prompt. Please check if the backend server is running on port 8000.");
  }
};
