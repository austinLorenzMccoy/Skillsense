"""
Create demo accounts for testing and hackathon judges
Run this script to create demo employee and employer accounts
"""
from app.core.db import SessionLocal, engine
from app.core.models import Base, User, Company, UserProfile
from app.core.auth import hash_password
import uuid

def create_demo_accounts():
    """Create demo accounts"""
    print("Creating demo accounts...")
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if demo employee exists
        demo_employee = db.query(User).filter(User.email == "demo@skillsense.ai").first()
        if not demo_employee:
            # Create demo employee
            demo_employee = User(
                email="demo@skillsense.ai",
                password_hash=hash_password("demo123456"),
                role="employee",
                is_verified=True,
                is_active=True
            )
            db.add(demo_employee)
            db.flush()
            
            # Create profile for demo employee
            demo_profile = UserProfile(
                user_id=demo_employee.id,
                visibility="public",
                github_url="https://github.com/torvalds",
                linkedin_url="https://linkedin.com/in/demo"
            )
            db.add(demo_profile)
            print("✅ Created demo employee: demo@skillsense.ai / demo123456")
        else:
            print("ℹ️  Demo employee already exists")
        
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
            
            # Create demo employer
            demo_employer = User(
                email="employer@skillsense.ai",
                password_hash=hash_password("demo123456"),
                role="employer",
                company_id=demo_company.id,
                is_verified=True,
                is_active=True
            )
            db.add(demo_employer)
            print("✅ Created demo employer: employer@skillsense.ai / demo123456")
        else:
            print("ℹ️  Demo employer already exists")
        
        db.commit()
        print("\n🎉 Demo accounts ready!")
        print("\nEmployee Login:")
        print("  Email: demo@skillsense.ai")
        print("  Password: demo123456")
        print("\nEmployer Login:")
        print("  Email: employer@skillsense.ai")
        print("  Password: demo123456")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_accounts()
