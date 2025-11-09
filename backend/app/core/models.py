from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, JSON, Enum, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('employee', 'employer', 'admin', name='user_role'), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id'), nullable=True)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="users")
    user_profile = relationship("UserProfile", back_populates="user", uselist=False)

class Company(Base):
    __tablename__ = "companies"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    website = Column(String(255), nullable=True)
    size = Column(String(50), nullable=True)
    industry = Column(String(100), nullable=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="company")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), unique=True, nullable=False)
    visibility = Column(Enum('private', 'employers', 'public', name='profile_visibility'), default='private')
    job_id = Column(String(255), nullable=True)  # Link to existing job analysis
    resume_url = Column(String(500), nullable=True)
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="user_profile")

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
