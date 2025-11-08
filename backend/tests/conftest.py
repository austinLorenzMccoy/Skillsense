import os
# Set testing environment BEFORE any other imports
os.environ["TESTING"] = "1"

import pytest
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.core.models import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use SQLite for testing (should match db.py logic)
TEST_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="session")
def db():
    # Create test database tables using test engine
    print(f"Creating tables with engine: {test_engine}")
    Base.metadata.create_all(bind=test_engine)
    print("Tables created")
    
    session = TestSessionLocal()
    print("Session created")
    try:
        yield session
    finally:
        session.close()
        # Clean up test database file
        import os
        if os.path.exists("./test.db"):
            os.remove("./test.db")
            print("Test DB cleaned up")

@pytest.fixture(scope="function")
def client(db):
    # The app will automatically use SQLite due to TESTING=1
    with TestClient(app) as test_client:
        yield test_client
