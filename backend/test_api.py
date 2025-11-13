"""
Test script for Prompt Engine Backend API
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api_client import PromptEngineAPI
import time
import json

def test_api_endpoints():
    """Test all API endpoints"""
    print("Starting API tests...")
    
    api = PromptEngineAPI("http://localhost:8000")
    
    # Test health check
    print("\n1. Testing health check...")
    try:
        response = requests.get("http://localhost:8000/api/health")
        if response.status_code == 200:
            print("✓ Health check passed")
        else:
            print(f"✗ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"✗ Health check error: {e}")
    
    # Test prompt generation
    print("\n2. Testing prompt generation...")
    try:
        result = api.generate_prompt("Create a Python function to calculate factorial")
        print("✓ Prompt generation successful")
        print(f"   Generated prompt ID: {result['id']}")
        print(f"   Original idea: {result['original_idea']}")
        prompt_id = result['id']
    except Exception as e:
        print(f"✗ Prompt generation failed: {e}")
        return
    
    # Test prompt testing
    print("\n3. Testing prompt testing...")
    try:
        test_result = api.test_prompt(result['generated_prompt_text'])
        print("✓ Prompt testing successful")
        print(f"   Test result length: {len(test_result)} characters")
    except Exception as e:
        print(f"✗ Prompt testing failed: {e}")
    
    # Test rating prompt
    print("\n4. Testing prompt rating...")
    try:
        rating_result = api.rate_prompt(prompt_id, 1)  # Upvote
        print("✓ Prompt rating successful")
        print(f"   Rating updated: {rating_result}")
    except Exception as e:
        print(f"✗ Prompt rating failed: {e}")
    
    # Test getting prompts
    print("\n5. Testing get prompts...")
    try:
        prompts = api.get_prompts(limit=10)
        print("✓ Get prompts successful")
        print(f"   Retrieved {len(prompts)} prompts")
    except Exception as e:
        print(f"✗ Get prompts failed: {e}")
    
    # Test stats
    print("\n6. Testing stats...")
    try:
        stats = api.get_stats()
        print("✓ Stats retrieval successful")
        print(f"   Total prompts: {stats.get('total_prompts', 0)}")
        print(f"   Average rating: {stats.get('average_rating', 0)}")
    except Exception as e:
        print(f"✗ Stats retrieval failed: {e}")
    
    print("\nAPI tests completed!")

def load_test():
    """Perform load testing"""
    print("\nStarting load test...")
    
    api = PromptEngineAPI("http://localhost:8000")
    
    test_ideas = [
        "Create a REST API in Python",
        "Build a data visualization dashboard",
        "Design a database schema",
        "Implement user authentication",
        "Create unit tests"
    ]
    
    success_count = 0
    total_time = 0
    
    for i, idea in enumerate(test_ideas):
        start_time = time.time()
        try:
            result = api.generate_prompt(idea)
            end_time = time.time()
            duration = end_time - start_time
            total_time += duration
            success_count += 1
            print(f"✓ Test {i+1}: {idea[:30]}... ({duration:.2f}s)")
        except Exception as e:
            print(f"✗ Test {i+1} failed: {e}")
    
    if success_count > 0:
        avg_time = total_time / success_count
        print(f"\nLoad test results:")
        print(f"   Success rate: {success_count}/{len(test_ideas)} ({success_count/len(test_ideas)*100:.1f}%)")
        print(f"   Average response time: {avg_time:.2f}s")
        print(f"   Total requests: {len(test_ideas)}")

if __name__ == "__main__":
    import requests
    
    print("Prompt Engine Backend API Tests")
    print("=" * 40)
    
    # Run tests
    test_api_endpoints()
    load_test()