"""
Simple script to create demo users
Run this directly on the server or locally with DATABASE_URL set
"""
import os
import sys
from passlib.context import CryptContext

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.db import SessionLocal, engine
from app.core.models import Base, User, Company, UserProfile

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_demo_accounts():
    """Create demo accounts"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Demo password
        demo_password = "demo123456"
        hashed_password = pwd_context.hash(demo_password)
        
        print(f"Hashed password length: {len(hashed_password)}")
        
        # Check if demo employee exists
        demo_employee = db.query(User).filter(User.email == "demo@skillsense.ai").first()
        if not demo_employee:
            print("Creating demo employee...")
            demo_employee = User(
                email="demo@skillsense.ai",
                password_hash=hashed_password,
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
            print("✅ Demo employee created!")
        else:
            print("Demo employee already exists")
        
        # Check if demo employer exists
        demo_employer = db.query(User).filter(User.email == "employer@skillsense.ai").first()
        if not demo_employer:
            print("Creating demo employer...")
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
                password_hash=hashed_password,
                role="employer",
                company_id=demo_company.id,
                is_verified=True,
                is_active=True
            )
            db.add(demo_employer)
            print("✅ Demo employer created!")
        else:
            print("Demo employer already exists")
        
        db.commit()
        print("\n✅ All demo accounts ready!")
        print("\nDemo Credentials:")
        print("Employee: demo@skillsense.ai / demo123456")
        print("Employer: employer@skillsense.ai / demo123456")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_accounts()
