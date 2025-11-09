#!/usr/bin/env python3
"""
Quick test script to verify backend components work
"""

import sys
import os

# Add the app directory to path
sys.path.insert(0, os.path.dirname(__file__))

def test_imports():
    """Test that all modules can be imported"""
    try:
        from app.main import app
        print("✅ FastAPI app imported successfully")

        from app.services.extractor import extract_explicit_skills
        print("✅ Skill extractor imported successfully")

        from app.services.llm_provider import get_llm_provider
        provider = get_llm_provider()
        print(f"✅ LLM provider loaded: {type(provider).__name__}")

        from app.core.db import SessionLocal
        print("✅ Database connection configured")

        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_skill_extraction():
    """Test skill extraction works"""
    try:
        from app.services.extractor import extract_explicit_skills

        text = "I work with Python, React, and machine learning"
        skills = extract_explicit_skills(text)

        print(f"✅ Extracted {len(skills)} skills from test text")
        for skill in skills:
            print(f"   - {skill['skill']} (confidence: {skill['confidence']:.2f})")

        return True
    except Exception as e:
        print(f"❌ Skill extraction error: {e}")
        return False

def main():
    print("🧪 SkillSense Backend Quick Test")
    print("=" * 40)

    success = True

    print("\n1. Testing imports...")
    success &= test_imports()

    print("\n2. Testing skill extraction...")
    success &= test_skill_extraction()

    print("\n" + "=" * 40)
    if success:
        print("🎉 All tests passed! Backend is ready.")
        return 0
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
