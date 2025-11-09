"""
Test Groq integration for skill extraction
"""
import os
import sys

# Groq API key should be set in environment or .env file
# For testing, ensure GROQ_API_KEY is set in backend/.env
if not os.getenv('GROQ_API_KEY'):
    print("⚠️  GROQ_API_KEY not set in environment")
    print("   Add it to backend/.env file or export it:")
    print("   export GROQ_API_KEY='your-key-here'")
    sys.exit(1)

print("=" * 60)
print("Testing Groq Integration")
print("=" * 60)

# Test 1: Check if Groq is available
print("\n1. Checking Groq availability...")
try:
    from app.services.groq_embeddings import GROQ_AVAILABLE, extract_skills_with_groq, embed_text
    print(f"   ✅ Groq Available: {GROQ_AVAILABLE}")
except Exception as e:
    print(f"   ❌ Error importing: {e}")
    sys.exit(1)

# Test 2: Extract skills from sample text
print("\n2. Testing skill extraction...")
sample_cv = """
I am a Senior Software Engineer with 5 years of Python experience.
I have built machine learning pipelines using TensorFlow and PyTorch.
Led a team of 3 developers and improved code quality by 40%.
Strong communication skills and experience with Agile methodologies.
"""

try:
    skills = extract_skills_with_groq(sample_cv)
    print(f"   ✅ Extracted {len(skills)} skills:")
    for skill in skills[:5]:  # Show first 5
        print(f"      - {skill.get('name')}: {skill.get('type')} (confidence: {skill.get('confidence')})")
except Exception as e:
    print(f"   ❌ Skill extraction error: {e}")

# Test 3: Generate embeddings
print("\n3. Testing embeddings generation...")
try:
    embedding = embed_text("Python developer with machine learning experience")
    print(f"   ✅ Generated embedding vector of length: {len(embedding)}")
    print(f"      First 5 values: {embedding[:5]}")
    
    # Check if it's not all zeros
    non_zero = sum(1 for x in embedding if x != 0.0)
    print(f"      Non-zero values: {non_zero}/{len(embedding)}")
except Exception as e:
    print(f"   ❌ Embedding error: {e}")

# Test 4: Test main embeddings module
print("\n4. Testing main embeddings module...")
try:
    from app.services.embeddings import embed_text as main_embed, USE_GROQ
    print(f"   ✅ USE_GROQ: {USE_GROQ}")
    
    test_embedding = main_embed("React developer")
    print(f"   ✅ Main module embedding length: {len(test_embedding)}")
except Exception as e:
    print(f"   ❌ Main module error: {e}")

print("\n" + "=" * 60)
print("Test Complete!")
print("=" * 60)
