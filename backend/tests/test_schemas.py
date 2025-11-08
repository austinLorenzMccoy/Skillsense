import pytest
from app.core.schemas import IngestResponse, JobStatus, ProfileResponse, SuggestBulletsRequest, SuggestBulletsResponse

def test_ingest_response():
    response = IngestResponse(jobId="test-job", estimatedSeconds=45)
    assert response.jobId == "test-job"
    assert response.estimatedSeconds == 45

def test_job_status():
    status = JobStatus(jobId="test-job", status="done", progress=100, message="Completed")
    assert status.jobId == "test-job"
    assert status.status == "done"
    assert status.progress == 100

def test_profile_response():
    profile = ProfileResponse(
        profileId="p123",
        name="John Doe",
        topSkills=[{"id": "s1", "name": "Python", "confidence": 0.9}],
        skills=[],
        graph={"nodes": [], "edges": []},
        personaScores={"developer": 0.8}
    )
    assert profile.profileId == "p123"
    assert profile.name == "John Doe"

def test_suggest_bullets_request():
    request = SuggestBulletsRequest(profileId="p123", skillId="s1", tone="concise")
    assert request.profileId == "p123"
    assert request.skillId == "s1"
    assert request.tone == "concise"

def test_suggest_bullets_response():
    response = SuggestBulletsResponse(
        bullets=[{"text": "Built Python app", "provenance": ["cv"]}],
        promptUsed="Template"
    )
    assert len(response.bullets) == 1
    assert response.promptUsed == "Template"
