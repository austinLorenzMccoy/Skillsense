from typing import List, Dict, Any
import numpy as np

# Use local sentence transformers for embeddings
try:
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    EMBEDDINGS_AVAILABLE = True
except ImportError:
    EMBEDDINGS_AVAILABLE = False
    model = None

def embed_text(text: str) -> List[float]:
    """Generate embeddings for text using sentence transformers"""
    if not EMBEDDINGS_AVAILABLE or not model:
        # Fallback: return zero vector of fixed size
        return [0.0] * 384  # Typical embedding size
    
    try:
        embedding = model.encode(text, convert_to_numpy=True)
        return embedding.tolist()
    except Exception as e:
        print(f"Embedding error: {e}")
        return [0.0] * 384

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    try:
        v1 = np.array(vec1)
        v2 = np.array(vec2)
        
        dot_product = np.dot(v1, v2)
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    except:
        return 0.0

def find_similar_skills(text_embedding: List[float], skill_embeddings: Dict[str, List[float]], threshold: float = 0.3) -> List[Dict[str, Any]]:
    """Find skills similar to the given text embedding"""
    similar_skills = []
    
    for skill_name, skill_embedding in skill_embeddings.items():
        similarity = cosine_similarity(text_embedding, skill_embedding)
        if similarity >= threshold:
            similar_skills.append({
                'skill': skill_name,
                'similarity': similarity
            })
    
    return sorted(similar_skills, key=lambda x: x['similarity'], reverse=True)

# Pre-computed skill embeddings (would be loaded from a file in production)
SKILL_EMBEDDINGS = {}

def get_skill_embeddings() -> Dict[str, List[float]]:
    """Get pre-computed embeddings for skills"""
    if not SKILL_EMBEDDINGS:
        # Initialize with some common skills
        common_skills = [
            "Python", "JavaScript", "React", "Node.js", "SQL", "Git",
            "Docker", "AWS", "Machine Learning", "Data Analysis"
        ]
        
        for skill in common_skills:
            SKILL_EMBEDDINGS[skill] = embed_text(skill)
    
    return SKILL_EMBEDDINGS

def upsert_embedding(evidence_id: str, text: str, metadata: Dict[str, Any] = None):
    """Store embedding for evidence (in-memory for now, would use vector DB in production)"""
    # In a real implementation, this would store in Chroma/Pinecone
    embedding = embed_text(text)
    
    # For now, just store in memory
    if not hasattr(upsert_embedding, 'embeddings_store'):
        upsert_embedding.embeddings_store = {}
    
    upsert_embedding.embeddings_store[evidence_id] = {
        'embedding': embedding,
        'text': text,
        'metadata': metadata or {}
    }

def search_similar_evidence(query_text: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Find evidence similar to query text"""
    if not hasattr(upsert_embedding, 'embeddings_store'):
        return []
    
    query_embedding = embed_text(query_text)
    results = []
    
    for evidence_id, data in upsert_embedding.embeddings_store.items():
        similarity = cosine_similarity(query_embedding, data['embedding'])
        results.append({
            'evidence_id': evidence_id,
            'similarity': similarity,
            'text': data['text'],
            'metadata': data['metadata']
        })
    
    return sorted(results, key=lambda x: x['similarity'], reverse=True)[:limit]
