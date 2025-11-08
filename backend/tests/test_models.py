import pytest
from app.core.models import Job, Profile, Skill, Evidence
from uuid import uuid4
from datetime import datetime

def test_job_creation(db):
    job = Job(id=uuid4(), status="queued", payload={"test": "data"})
    db.add(job)
    db.commit()
    assert job.id is not None
    assert job.status == "queued"

def test_profile_creation(db):
    profile = Profile(id=uuid4(), name="Test User", summary="Test summary")
    db.add(profile)
    db.commit()
    assert profile.id is not None
    assert profile.name == "Test User"

def test_skill_creation(db):
    skill = Skill(id=uuid4(), name="Python", type="hard")
    db.add(skill)
    db.commit()
    assert skill.id is not None
    assert skill.name == "Python"

def test_evidence_creation(db):
    profile = Profile(id=uuid4(), name="Test")
    skill = Skill(id=uuid4(), name="Test Skill", type="hard")
    db.add(profile)
    db.add(skill)
    db.commit()
    
    evidence = Evidence(
        id=uuid4(),
        profile_id=profile.id,
        skill_id=skill.id,
        source_type="cv",
        snippet="Test snippet",
        confidence_weight=0.8
    )
    db.add(evidence)
    db.commit()
    assert evidence.id is not None
    assert evidence.confidence_weight == 0.8
