import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_ingest_endpoint(mocker):
    # Mock SessionLocal to avoid database connection
    mock_session = mocker.MagicMock()
    mock_session.add.return_value = None
    mock_session.commit.return_value = None
    mock_session.close.return_value = None
    
    mocker.patch('app.core.db.SessionLocal', return_value=mocker.MagicMock(return_value=mock_session))
    
    response = client.post("/api/v1/ingest", data={"urls": '["https://github.com"]', "options": "{}"})
    assert response.status_code == 200
    data = response.json()
    assert "jobId" in data
    assert "estimatedSeconds" in data

def test_job_status_endpoint(mocker):
    # Mock the database query
    mock_session = mocker.MagicMock()
    mock_job = mocker.MagicMock()
    mock_job.id = "test-job"
    mock_job.status = "done"
    mock_session.query.return_value.filter.return_value.first.return_value = mock_job
    mock_session.close.return_value = None
    
    mocker.patch('app.core.db.SessionLocal', return_value=mocker.MagicMock(return_value=mock_session))
    
    response = client.get("/api/v1/status/test-job")
    assert response.status_code == 200
    data = response.json()
    assert data["jobId"] == "test-job"
    assert "status" in data

def test_profile_endpoint_not_ready(mocker):
    # Mock the database query to return None (job not found)
    mock_session = mocker.MagicMock()
    mock_session.query.return_value.filter.return_value.first.return_value = None
    mock_session.close.return_value = None
    
    mocker.patch('app.core.db.SessionLocal', return_value=mocker.MagicMock(return_value=mock_session))
    
    response = client.get("/api/v1/profile/non-existent")
    assert response.status_code == 404

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
