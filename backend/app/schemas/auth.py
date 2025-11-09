"""
Pydantic schemas for authentication
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    EMPLOYEE = "employee"
    EMPLOYER = "employer"
    ADMIN = "admin"

class ProfileVisibility(str, Enum):
    PRIVATE = "private"
    EMPLOYERS = "employers"
    PUBLIC = "public"

# Registration schemas
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    role: UserRole
    company_name: Optional[str] = None  # Required if role is employer
    
    @validator('company_name')
    def validate_company_name(cls, v, values):
        if values.get('role') == UserRole.EMPLOYER and not v:
            raise ValueError('Company name is required for employers')
        return v

class RegisterResponse(BaseModel):
    user_id: str
    email: str
    role: str
    message: str

# Login schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

# User schemas
class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    company_id: Optional[str] = None
    is_verified: bool
    is_active: bool
    
    class Config:
        from_attributes = True

class UserProfileResponse(BaseModel):
    id: str
    user_id: str
    visibility: str
    job_id: Optional[str] = None
    resume_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    
    class Config:
        from_attributes = True

# Company schemas
class CompanyResponse(BaseModel):
    id: str
    name: str
    website: Optional[str] = None
    size: Optional[str] = None
    industry: Optional[str] = None
    verified: bool
    
    class Config:
        from_attributes = True

# Update profile visibility
class UpdateVisibilityRequest(BaseModel):
    visibility: ProfileVisibility
