"""Test script for the iStampit API"""
import requests
import json

def test_api():
    base_url = "http://localhost:8080"

    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/healthz")
        print(f"Health check: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")

    # Test stamp endpoint
    try:
        test_hash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        data = {"hash": test_hash}
        response = requests.post(f"{base_url}/stamp", json=data)
        print(f"Stamp request: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Stamp request failed: {e}")

if __name__ == "__main__":
    test_api()
