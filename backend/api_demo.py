#!/usr/bin/env python3
"""
API Demo Script for SkillSense Backend
This script demonstrates all API endpoints with curl commands
"""

import subprocess
import json
import time

BASE_URL = "http://localhost:8000"

def run_curl(command):
    """Run a curl command and return the response"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.stdout, result.stderr, result.returncode
    except Exception as e:
        return None, str(e), 1

def demo_health():
    print("=== Health Check ===")
    cmd = f"curl -X GET {BASE_URL}/health"
    stdout, stderr, code = run_curl(cmd)
    print(f"Command: {cmd}")
    if code == 0:
        print(f"Response: {stdout}")
    else:
        print(f"Error: {stderr}")
    print()

def demo_ingest():
    print("=== Ingest CV ===")
    cmd = f'''curl -X POST {BASE_URL}/api/v1/ingest \
  -F "urls=[\\"https://github.com/example\\", \\"https://linkedin.com/in/example\\"]" \
  -F "options={{\\"includeGithub\\": true, \\"includeLinkedIn\\": true}}"'''
    stdout, stderr, code = run_curl(cmd)
    print(f"Command: {cmd}")
    if code == 0:
        try:
            response = json.loads(stdout)
            job_id = response.get("jobId")
            print(f"Response: {json.dumps(response, indent=2)}")
            return job_id
        except:
            print(f"Response: {stdout}")
    else:
        print(f"Error: {stderr}")
    print()
    return None

def demo_status(job_id):
    if not job_id:
        return
    print("=== Job Status ===")
    cmd = f"curl -X GET {BASE_URL}/api/v1/status/{job_id}"
    stdout, stderr, code = run_curl(cmd)
    print(f"Command: {cmd}")
    if code == 0:
        print(f"Response: {json.dumps(json.loads(stdout), indent=2)}")
    else:
        print(f"Error: {stderr}")
    print()

def demo_profile(job_id):
    if not job_id:
        return
    print("=== Get Profile ===")
    cmd = f"curl -X GET {BASE_URL}/api/v1/profile/{job_id}"
    stdout, stderr, code = run_curl(cmd)
    print(f"Command: {cmd}")
    if code == 0:
        print(f"Response: {json.dumps(json.loads(stdout), indent=2)}")
    else:
        print(f"Error: {stderr}")
    print()

def demo_suggest_bullets():
    print("=== Suggest CV Bullets ===")
    data = {
        "profileId": "p123",
        "skillId": "s1",
        "tone": "concise"
    }
    cmd = f"""curl -X POST {BASE_URL}/api/v1/reasoning/suggest-bullets \
  -H "Content-Type: application/json" \
  -d '{json.dumps(data)}'"""
    stdout, stderr, code = run_curl(cmd)
    print(f"Command: {cmd}")
    if code == 0:
        print(f"Response: {json.dumps(json.loads(stdout), indent=2)}")
    else:
        print(f"Error: {stderr}")
    print()

def demo_delete_profile():
    print("=== Delete Profile ===")
    cmd = f"curl -X DELETE {BASE_URL}/api/v1/profile/p123"
    stdout, stderr, code = run_curl(cmd)
    print(f"Command: {cmd}")
    if code == 0:
        print(f"Response: {stdout}")
    else:
        print(f"Error: {stderr}")
    print()

def main():
    print("SkillSense Backend API Demo")
    print("=" * 50)
    print(f"Base URL: {BASE_URL}")
    print()

    # Test health
    demo_health()

    # Test ingest
    job_id = demo_ingest()

    # Wait a bit for processing
    if job_id:
        print("Waiting for job processing...")
        time.sleep(2)

        # Test status
        demo_status(job_id)

        # Test profile (may not be ready yet)
        demo_profile(job_id)

    # Test suggest bullets
    demo_suggest_bullets()

    # Test delete
    demo_delete_profile()

    print("API Demo completed!")

if __name__ == "__main__":
    main()
