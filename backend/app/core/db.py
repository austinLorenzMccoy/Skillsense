from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.models import Base
import os

# Support for test database
if os.getenv("TESTING"):
    DATABASE_URL = "sqlite:///./test.db"
    print(f"Using TEST database: {DATABASE_URL}")
else:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://skillsense:changeme@localhost:5432/skillsense")
    print(f"Using PROD database: {DATABASE_URL}")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
