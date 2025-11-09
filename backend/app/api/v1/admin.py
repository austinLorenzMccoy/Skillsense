"""
Admin endpoints for database initialization and management
"""
from fastapi import APIRouter, HTTPException, Depends
from app.core.db import engine, get_db
from app.core.models import Base, User, Company, UserProfile
from app.core.auth import hash_password, pwd_context
from sqlalchemy.orm import Session
import os

router = APIRouter()

# Simple secret for initialization (change this!)
INIT_SECRET = os.getenv("INIT_SECRET", "change-me-in-production")

@router.post("/init-db")
async def initialize_database(secret: str):
    """
    Initialize database tables and create demo accounts
    Call this once after deployment to set up the database
    """
    if secret != INIT_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        # Create demo accounts
        db = next(get_db())
        
        # Simple password for demo
        demo_password = "demo123456"
        
        # Hash password once for both users
        try:
            hashed_pwd = pwd_context.hash(demo_password)
        except Exception as hash_error:
            raise HTTPException(status_code=500, detail=f"Password hashing failed: {str(hash_error)}")
        
        # Check if demo employee exists
        demo_employee = db.query(User).filter(User.email == "demo@skillsense.ai").first()
        if not demo_employee:
            
            demo_employee = User(
                email="demo@skillsense.ai",
                password_hash=hashed_pwd,
                role="employee",
                is_verified=True,
                is_active=True
            )
            db.add(demo_employee)
            db.flush()
            
            # Create profile
            demo_profile = UserProfile(
                user_id=demo_employee.id,
                visibility="public",
                github_url="https://github.com/torvalds",
                linkedin_url="https://linkedin.com/in/demo"
            )
            db.add(demo_profile)
        
        # Check if demo employer exists
        demo_employer = db.query(User).filter(User.email == "employer@skillsense.ai").first()
        if not demo_employer:
            # Create demo company
            demo_company = Company(
                name="Demo Company",
                website="https://demo.com",
                verified=True
            )
            db.add(demo_company)
            db.flush()
            
            # Create employer
            demo_employer = User(
                email="employer@skillsense.ai",
                password_hash=hashed_pwd,
                role="employer",
                company_id=demo_company.id,
                is_verified=True,
                is_active=True
            )
            db.add(demo_employer)
        
        db.commit()
        db.close()
        
        return {
            "status": "success",
            "message": "Database initialized successfully",
            "tables_created": [
                "users",
                "companies",
                "user_profiles",
                "jobs",
                "profiles",
                "skills",
                "evidence"
            ],
            "demo_accounts": [
                {"email": "demo@skillsense.ai", "role": "employee"},
                {"email": "employer@skillsense.ai", "role": "employer"}
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database initialization failed: {str(e)}")

@router.get("/health-check")
async def health_check(db: Session = Depends(get_db)):
    """
    Check if database is accessible and tables exist
    """
    try:
        # Try to query users table
        user_count = db.query(User).count()
        return {
            "status": "healthy",
            "database": "connected",
            "users_count": user_count
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "error",
            "error": str(e)
        }
