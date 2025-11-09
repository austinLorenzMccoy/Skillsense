"""
Create authentication tables in the database
Run this script to add User, Company, and UserProfile tables
"""
from app.core.db import engine
from app.core.models import Base, User, Company, UserProfile

def create_auth_tables():
    """Create all auth-related tables"""
    print("Creating authentication tables...")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    print("✅ Authentication tables created successfully!")
    print("\nTables created:")
    print("  - users")
    print("  - companies")
    print("  - user_profiles")
    print("\nYou can now use the authentication endpoints:")
    print("  POST /api/v1/auth/register")
    print("  POST /api/v1/auth/login")
    print("  GET  /api/v1/auth/me")

if __name__ == "__main__":
    create_auth_tables()
