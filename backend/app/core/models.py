from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

Base = declarative_base()

class Job(Base):
    __tablename__ = "jobs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(Enum('queued', 'parsing', 'extracting', 'inferring', 'scoring', 'done', 'error', name='job_status'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    profile_id = Column(UUID(as_uuid=True), nullable=True)
    payload = Column(JSON)
    error = Column(Text, nullable=True)

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)
    source_manifest = Column(JSON)
    top_skills = Column(JSON)

class Skill(Base):
    __tablename__ = "skills"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True)
    type = Column(Enum('hard', 'soft', 'emerging', name='skill_type'))
    ontology_ref = Column(String, nullable=True)

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey('profiles.id'))
    skill_id = Column(UUID(as_uuid=True), ForeignKey('skills.id'))
    source_type = Column(Enum('cv', 'github', 'linkedin', 'blog', 'llm', name='source_type'))
    snippet = Column(Text)
    source_url = Column(Text, nullable=True)
    confidence_weight = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
