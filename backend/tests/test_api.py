import pytest
import os
os.environ["TESTING"] = "1"  # Set before imports

from fastapi.testclient import TestClient
from app.main import app
from app.core.db import engine, create_tables
from app.core.models import Base

# Create tables before tests
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "1.0.0"

def test_ingest_endpoint():
    # Test with real SQLite database
    response = client.post("/api/v1/ingest", data={"urls": '["https://github.com"]', "options": "{}"})
    assert response.status_code == 200
    data = response.json()
    assert "jobId" in data
    assert "estimatedSeconds" in data

def test_job_status_endpoint():
    # First create a job via ingest
    ingest_response = client.post("/api/v1/ingest", data={"urls": '["https://github.com/test"]'})
    assert ingest_response.status_code == 200
    job_id = ingest_response.json()["jobId"]
    
    # Then check its status
    response = client.get(f"/api/v1/status/{job_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["jobId"] == job_id
    assert "status" in data

def test_profile_endpoint_not_ready():
    # Test with non-existent job ID
    response = client.get("/api/v1/profile/non-existent-job-id")
    # Should return 400 or 404 depending on validation
    assert response.status_code in [400, 404]

def test_suggest_bullets_endpoint():
    request_data = {
        "profileId": "p123",
        "skillId": "s1",
        "tone": "concise"
    }
    response = client.post("/api/v1/reasoning/suggest-bullets", json=request_data)
    assert response.status_code == 200
    data = response.json()
    assert "bullets" in data
    assert "promptUsed" in data

def test_delete_profile_endpoint():
    response = client.delete("/api/v1/profile/p123")
    assert response.status_code == 200
