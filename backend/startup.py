"""
Startup script to initialize database tables on first run
"""
from app.core.db import engine
from app.core.models import Base
import os

def init_database():
    """Create all database tables if they don't exist"""
    try:
        print("🔄 Checking database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables ready!")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")

if __name__ == "__main__":
    init_database()
