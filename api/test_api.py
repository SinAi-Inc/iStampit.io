#!/usr/bin/env python3
"""
Test client for iStampit API
Demonstrates stamping and verification workflows
"""
import requests
import hashlib
import base64
import sys
import json
from pathlib import Path

API_BASE = "http://localhost:8080"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{API_BASE}/healthz")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    return response.status_code == 200

def test_stamp():
    """Test stamping a hash"""
    print("\n📝 Testing stamp endpoint...")
    
    # Use empty file hash as test
    test_hash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    
    response = requests.post(
        f"{API_BASE}/stamp",
        json={"hash": test_hash}
    )
    
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Hash: {data['hash']}")
        print(f"   Receipt size: {data['size']} bytes")
        print(f"   Stamped at: {data['stampedAt']}")
        return data
    else:
        print(f"   Error: {response.text}")
        return None

def test_verify(receipt_data):
    """Test verification endpoint"""
    print("\n🔍 Testing verify endpoint...")
    
    if not receipt_data:
        print("   Skipped - no receipt to verify")
        return
    
    response = requests.post(
        f"{API_BASE}/verify",
        json={
            "hash": receipt_data['hash'],
            "receiptB64": receipt_data['receiptB64']
        }
    )
    
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Verified: {data['verified']}")
        print(f"   Bitcoin confirmed: {data['bitcoinConfirmed']}")
        print(f"   Message: {data['message']}")
        if data.get('blockHeight'):
            print(f"   Block height: {data['blockHeight']}")
    else:
        print(f"   Error: {response.text}")

def test_stamp_file():
    """Test file stamping endpoint"""
    print("\n📄 Testing stamp-file endpoint...")
    
    # Create a temporary test file
    test_file = Path("test_file.txt")
    test_file.write_text("Hello from SinAI Inc!")
    
    try:
        with open(test_file, 'rb') as f:
            response = requests.post(
                f"{API_BASE}/stamp-file",
                files={"file": f}
            )
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Filename: {data['filename']}")
            print(f"   File size: {data['size']} bytes")
            print(f"   Hash: {data['hash']}")
            print(f"   Receipt size: {data['receipt']['size']} bytes")
            
            # Save receipt
            receipt_b64 = data['receipt']['receiptB64']
            receipt_bytes = base64.b64decode(receipt_b64)
            receipt_file = test_file.with_suffix('.txt.ots')
            receipt_file.write_bytes(receipt_bytes)
            print(f"   Saved receipt to: {receipt_file}")
            
            return data
        else:
            print(f"   Error: {response.text}")
            return None
    finally:
        if test_file.exists():
            test_file.unlink()

def main():
    """Run all tests"""
    print("=" * 60)
    print("iStampit API Test Suite")
    print("=" * 60)
    
    try:
        # Test health
        if not test_health():
            print("\n❌ Health check failed - is the API running?")
            print("   Start it with: python api/app.py")
            sys.exit(1)
        
        # Test stamping
        receipt_data = test_stamp()
        
        # Test verification
        test_verify(receipt_data)
        
        # Test file stamping
        test_stamp_file()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to API")
        print("   Start it with: python api/app.py")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
