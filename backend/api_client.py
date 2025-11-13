"""
Frontend Integration Module for Prompt Engine Backend
This module provides functions to interact with the FastAPI backend
"""

import requests
import json
from typing import List, Optional, Dict, Any

class PromptEngineAPI:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.headers = {
            "Content-Type": "application/json"
        }
    
    def generate_prompt(self, idea: str, files: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """Generate optimized prompt from user idea"""
        url = f"{self.base_url}/api/generate"
        data = {
            "idea": idea,
            "files": files or []
        }
        
        response = requests.post(url, json=data, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API Error: {response.status_code} - {response.text}")
    
    def test_prompt(self, prompt: str) -> str:
        """Test prompt against AI model"""
        url = f"{self.base_url}/api/test"
        data = {"prompt": prompt}
        
        response = requests.post(url, json=data, headers=self.headers)
        if response.status_code == 200:
            result = response.json()
            return result["test_result"]
        else:
            raise Exception(f"API Error: {response.status_code} - {response.text}")
    
    def get_prompts(self, skip: int = 0, limit: int = 100, search: Optional[str] = None, rating: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get prompt history"""
        url = f"{self.base_url}/api/prompts"
        params = {"skip": skip, "limit": limit}
        
        if search:
            params["search"] = search
        if rating is not None:
            params["rating"] = rating
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API Error: {response.status_code} - {response.text}")
    
    def rate_prompt(self, prompt_id: str, rating: int) -> Dict[str, Any]:
        """Update prompt rating"""
        url = f"{self.base_url}/api/prompts/{prompt_id}/rate"
        data = {"rating": rating}
        
        response = requests.post(url, json=data, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API Error: {response.status_code} - {response.text}")
    
    def delete_prompt(self, prompt_id: str) -> Dict[str, Any]:
        """Delete prompt from history"""
        url = f"{self.base_url}/api/prompts/{prompt_id}"
        
        response = requests.delete(url)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API Error: {response.status_code} - {response.text}")
    
    def upload_file(self, file_path: str) -> Dict[str, Any]:
        """Upload file"""
        url = f"{self.base_url}/api/upload"
        
        with open(file_path, 'rb') as file:
            files = {'file': file}
            response = requests.post(url, files=files)
            
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API Error: {response.status_code} - {response.text}")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get application statistics"""
        url = f"{self.base_url}/api/stats"
        
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API Error: {response.status_code} - {response.text}")

# Frontend Integration Examples

def example_usage():
    """Example of how to use the API from frontend"""
    api = PromptEngineAPI("http://localhost:8000")
    
    # Generate a prompt
    try:
        result = api.generate_prompt("A Python function to sort a list")
        print("Generated prompt:", result)
        
        # Test the generated prompt
        test_result = api.test_prompt(result["generated_prompt_text"])
        print("Test result:", test_result)
        
        # Save the prompt to history (it's already saved in DB)
        # Update rating
        rating_result = api.rate_prompt(result["id"], 1)  # Upvote
        print("Rating updated:", rating_result)
        
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    example_usage()