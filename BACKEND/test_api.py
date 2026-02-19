#!/usr/bin/env python3
"""
Test script for CV Analyzer Pro API
Tests all endpoints to verify functionality
"""

import requests
import sys
import json
from pathlib import Path

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("\n🏥 Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ API Status: {data['status']}")
            print(f"  🗄️  Database: {data['database']}")
            return True
        else:
            print(f"  ❌ Unexpected status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"  ❌ Cannot connect to {BASE_URL}")
        print("  💡 Make sure the server is running: uvicorn main:app --reload")
        return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def test_upload_cv(pdf_path: str):
    """Test CV upload endpoint"""
    print(f"\n📄 Testing CV Upload ({pdf_path})...")
    try:
        if not Path(pdf_path).exists():
            print(f"  ⚠️  File not found: {pdf_path}")
            print("  💡 Skipping upload test")
            return None

        with open(pdf_path, 'rb') as f:
            files = {'file': (Path(pdf_path).name, f, 'application/pdf')}
            response = requests.post(f"{BASE_URL}/candidate/analyze", files=files, timeout=30)

        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Upload successful")
            print(f"  👤 Name: {data['data'].get('name', 'N/A')}")
            print(f"  📧 Email: {data['data'].get('email', 'N/A')}")
            print(f"  🔧 Skills: {', '.join(data['data'].get('skills', [])[:5])}")
            cv_id = data['data'].get('cv_id')
            if cv_id:
                print(f"  🆔 CV ID: {cv_id}")
            return cv_id
        else:
            print(f"  ❌ Upload failed: {response.status_code}")
            print(f"  💬 {response.text}")
            return None
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return None

def test_list_cvs():
    """Test list CVs endpoint"""
    print("\n📋 Testing List CVs...")
    try:
        response = requests.get(f"{BASE_URL}/candidate/list", timeout=5)
        if response.status_code == 200:
            data = response.json()
            cvs = data.get('cvs', [])
            print(f"  ✅ Found {len(cvs)} CV(s)")
            return cvs
        else:
            print(f"  ❌ Failed: {response.status_code}")
            return []
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return []

def test_get_cv(cv_id: str):
    """Test get CV by ID endpoint"""
    print(f"\n🔍 Testing Get CV ({cv_id})...")
    try:
        response = requests.get(f"{BASE_URL}/candidate/{cv_id}", timeout=5)
        if response.status_code == 200:
            print(f"  ✅ CV retrieved successfully")
            return True
        else:
            print(f"  ❌ Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def test_create_job():
    """Test create job endpoint"""
    print("\n💼 Testing Create Job...")
    try:
        job_data = {
            "title": "Python Developer",
            "posts": 2,
            "description": "We are looking for an experienced Python developer with FastAPI and MongoDB knowledge. Must have 3+ years of experience."
        }
        response = requests.post(f"{BASE_URL}/recruiter/jobs", json=job_data, timeout=5)

        if response.status_code == 200:
            data = response.json()
            job_id = data.get('job_id')
            print(f"  ✅ Job created successfully")
            print(f"  🆔 Job ID: {job_id}")
            return job_id
        else:
            print(f"  ❌ Failed: {response.status_code}")
            print(f"  💬 {response.text}")
            return None
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return None

def test_list_jobs():
    """Test list jobs endpoint"""
    print("\n📋 Testing List Jobs...")
    try:
        response = requests.get(f"{BASE_URL}/recruiter/jobs", timeout=5)
        if response.status_code == 200:
            data = response.json()
            jobs = data.get('jobs', [])
            print(f"  ✅ Found {len(jobs)} job(s)")
            return jobs
        else:
            print(f"  ❌ Failed: {response.status_code}")
            return []
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return []

def test_match_candidates():
    """Test match candidates endpoint"""
    print("\n🎯 Testing Match Candidates...")
    try:
        job_data = {
            "title": "Senior Python Developer",
            "posts": 3,
            "description": "Looking for experienced Python developers with FastAPI, MongoDB, and Docker experience. Machine learning knowledge is a plus."
        }
        response = requests.post(f"{BASE_URL}/recruiter/match", json=job_data, timeout=60)

        if response.status_code == 200:
            data = response.json()
            total = data.get('total_candidates', 0)
            valid = data.get('valid_candidates', 0)
            selected = len(data.get('selected', []))

            print(f"  ✅ Matching completed")
            print(f"  📊 Total candidates: {total}")
            print(f"  ✅ Valid matches: {valid}")
            print(f"  🎯 Selected: {selected}")

            if data.get('selected'):
                print("\n  🏆 Top Candidates:")
                for i, match in enumerate(data['selected'][:3], 1):
                    print(f"     {i}. {match['candidate_name']} - Score: {match['match_score']}%")

            return True
        else:
            print(f"  ❌ Failed: {response.status_code}")
            print(f"  💬 {response.text}")
            return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def test_delete_cv(cv_id: str):
    """Test delete CV endpoint"""
    print(f"\n🗑️  Testing Delete CV ({cv_id})...")
    try:
        response = requests.delete(f"{BASE_URL}/candidate/{cv_id}", timeout=5)
        if response.status_code == 200:
            print(f"  ✅ CV deleted successfully")
            return True
        else:
            print(f"  ❌ Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def main():
    print("="*60)
    print("🚀 CV Analyzer Pro - API Test Suite")
    print("="*60)

    # Check if server is running
    if not test_health():
        print("\n❌ Server is not running. Please start it first:")
        print("   cd BACKEND && uvicorn main:app --reload")
        sys.exit(1)

    # Get test file path
    test_file = "cv.pdf"
    if len(sys.argv) > 1:
        test_file = sys.argv[1]

    # Run tests
    cv_id = None
    job_id = None

    # Test CV upload
    cv_id = test_upload_cv(test_file)

    # Test list CVs
    cvs = test_list_cvs()

    # Test get CV (if we have an ID)
    if cv_id:
        test_get_cv(cv_id)
    elif cvs:
        test_get_cv(cvs[0]['id'])

    # Test job creation
    job_id = test_create_job()

    # Test list jobs
    test_list_jobs()

    # Test matching
    test_match_candidates()

    # Summary
    print("\n" + "="*60)
    print("📊 Test Summary")
    print("="*60)
    print(f"  📄 Test CV uploaded: {'Yes' if cv_id else 'No'}")
    print(f"  💼 Test job created: {'Yes' if job_id else 'No'}")
    print(f"  📚 Total CVs in DB: {len(cvs)}")

    print("\n✨ All tests completed!")
    print(f"\n📖 API Documentation: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
