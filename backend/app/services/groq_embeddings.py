"""
Groq-based embeddings service for free tier deployment
Uses Groq's LLM API to generate embeddings via text analysis
"""
from typing import List, Dict, Any
import os
import json
from groq import Groq

# Initialize Groq client
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_AVAILABLE = bool(GROQ_API_KEY)

if GROQ_AVAILABLE:
    client = Groq(api_key=GROQ_API_KEY)
    print("✅ Groq API initialized successfully")
else:
    client = None
    print("⚠️ GROQ_API_KEY not set, using fallback embeddings")

def generate_skill_embedding_via_llm(text: str) -> List[float]:
    """
    Generate embeddings using Groq's LLM by analyzing text semantically
    Returns a simplified embedding vector based on skill categories
    """
    if not GROQ_AVAILABLE or not client:
        return [0.0] * 384  # Fallback
    
    try:
        # Use Groq to analyze the text and extract semantic features
        prompt = f"""Analyze this text and rate it (0.0 to 1.0) for these skill categories:
Technical: programming, software, tools
Leadership: management, mentoring, team
Communication: writing, presenting, collaboration
Problem-solving: debugging, optimization, architecture
Domain: industry-specific knowledge
Creativity: design, innovation, ideation

Text: "{text[:500]}"

Respond ONLY with JSON: {{"technical": 0.0, "leadership": 0.0, "communication": 0.0, "problem_solving": 0.0, "domain": 0.0, "creativity": 0.0}}"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Fast, free tier model
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=100
        )
        
        # Parse response
        result = json.loads(response.choices[0].message.content)
        
        # Convert to 384-dim vector (repeat pattern for compatibility)
        base_vector = [
            result.get('technical', 0.0),
            result.get('leadership', 0.0),
            result.get('communication', 0.0),
            result.get('problem_solving', 0.0),
            result.get('domain', 0.0),
            result.get('creativity', 0.0)
        ]
        
        # Expand to 384 dimensions by repeating and adding noise
        embedding = []
        for i in range(64):  # 64 * 6 = 384
            for val in base_vector:
                embedding.append(val + (i * 0.001))  # Slight variation
        
        return embedding[:384]
        
    except Exception as e:
        print(f"Groq embedding error: {e}")
        return [0.0] * 384

def extract_skills_with_groq(text: str) -> List[Dict[str, Any]]:
    """
    Use Groq to extract skills from text with confidence scores
    """
    if not GROQ_AVAILABLE or not client:
        return []
    
    try:
        prompt = f"""Extract ALL technical and soft skills from this text. For each skill, provide:
1. Skill name
2. Type (hard/soft/emerging)
3. Confidence (0.0-1.0)
4. Evidence quote (exact text snippet)

Text: "{text[:2000]}"

Respond ONLY with JSON array:
[{{"name": "Python", "type": "hard", "confidence": 0.95, "evidence": "5 years Python experience"}}]"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=1000
        )
        
        # Parse JSON response
        content = response.choices[0].message.content
        # Extract JSON from markdown code blocks if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        skills = json.loads(content)
        return skills
        
    except Exception as e:
        print(f"Groq skill extraction error: {e}")
        return []

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    import math
    
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    magnitude1 = math.sqrt(sum(a * a for a in vec1))
    magnitude2 = math.sqrt(sum(b * b for b in vec2))
    
    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0
    
    return dot_product / (magnitude1 * magnitude2)

# Cache for embeddings to reduce API calls
_embedding_cache = {}

def embed_text(text: str, use_cache: bool = True) -> List[float]:
    """
    Generate embeddings for text using Groq
    Uses caching to minimize API calls
    """
    if use_cache and text in _embedding_cache:
        return _embedding_cache[text]
    
    embedding = generate_skill_embedding_via_llm(text)
    
    if use_cache:
        _embedding_cache[text] = embedding
    
    return embedding
