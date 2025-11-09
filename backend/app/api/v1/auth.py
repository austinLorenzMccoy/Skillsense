"""
Authentication API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from app.core.models import User, Company, UserProfile
from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    UserResponse,
    UserProfileResponse
)
import uuid

router = APIRouter()

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user (employee or employer)
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create company if employer
    company_id = None
    if request.role == "employer" and request.company_name:
        company = Company(
            name=request.company_name,
            verified=False
        )
        db.add(company)
        db.flush()  # Get company ID
        company_id = company.id
    
    # Create user
    user = User(
        email=request.email,
        password_hash=hash_password(request.password),
        role=request.role,
        company_id=company_id,
        is_verified=False,  # TODO: Send verification email
        is_active=True
    )
    db.add(user)
    db.flush()
    
    # Create user profile for employees
    if request.role == "employee":
        user_profile = UserProfile(
            user_id=user.id,
            visibility="private"
        )
        db.add(user_profile)
    
    db.commit()
    
    return RegisterResponse(
        user_id=str(user.id),
        email=user.email,
        role=user.role,
        message="Registration successful. Please verify your email."
    )

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login and get access token
    """
    # Find user
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Create access token
    token_data = {
        "user_id": str(user.id),
        "email": user.email,
        "role": user.role,
        "company_id": str(user.company_id) if user.company_id else None
    }
    access_token = create_access_token(token_data)
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            role=user.role,
            company_id=str(user.company_id) if user.company_id else None,
            is_verified=user.is_verified,
            is_active=user.is_active
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user information
    """
    user = db.query(User).filter(User.id == uuid.UUID(current_user["user_id"])).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(user.id),
        email=user.email,
        role=user.role,
        company_id=str(user.company_id) if user.company_id else None,
        is_verified=user.is_verified,
        is_active=user.is_active
    )

@router.get("/me/profile", response_model=UserProfileResponse)
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's profile (employees only)
    """
    if current_user["role"] != "employee":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employees have profiles"
        )
    
    profile = db.query(UserProfile).filter(
        UserProfile.user_id == uuid.UUID(current_user["user_id"])
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return UserProfileResponse(
        id=str(profile.id),
        user_id=str(profile.user_id),
        visibility=profile.visibility,
        job_id=profile.job_id,
        resume_url=profile.resume_url,
        github_url=profile.github_url,
        linkedin_url=profile.linkedin_url
    )

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Logout (client should delete token)
    """
    return {"message": "Logged out successfully"}
