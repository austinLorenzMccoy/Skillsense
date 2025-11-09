import re
from typing import List, Dict, Any
from .skill_ontology import get_local_skills, normalize_skill

# Try to import spaCy, make it optional
try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
    SPACY_AVAILABLE = True
except (ImportError, OSError):
    nlp = None
    SPACY_AVAILABLE = False
    print("Warning: spaCy not available, using basic text processing")

def extract_explicit_skills(text: str) -> List[Dict[str, Any]]:
    """Extract explicit skills mentioned in text using NLP and keyword matching"""
    if not text:
        return []
    
    skills_found = []
    text_lower = text.lower()
    
    # Get all known skills
    all_skills = get_local_skills()
    
    # Direct keyword matching (case-insensitive)
    for skill in all_skills:
        skill_lower = skill.lower()
        if skill_lower in text_lower:
            # Count occurrences
            count = text_lower.count(skill_lower)
            # Find context around the skill mention
            context = extract_context(text, skill, 100)
            
            skills_found.append({
                'skill': skill,
                'confidence': min(0.9, 0.5 + (count * 0.1)),  # Higher confidence for multiple mentions
                'mentions': count,
                'context': context,
                'type': 'explicit'
            })
    
    # NLP-based extraction if spaCy is available
    if SPACY_AVAILABLE and nlp:
        skills_found.extend(extract_with_spacy(text))
    
    # Remove duplicates and sort by confidence
    unique_skills = {}
    for skill in skills_found:
        name = skill['skill']
        if name not in unique_skills or skill['confidence'] > unique_skills[name]['confidence']:
            unique_skills[name] = skill
    
    return sorted(unique_skills.values(), key=lambda x: x['confidence'], reverse=True)

def extract_with_spacy(text: str) -> List[Dict[str, Any]]:
    """Use spaCy for more sophisticated skill extraction"""
    if not SPACY_AVAILABLE or not nlp:
        return []
        
    doc = nlp(text)
    skills_found = []
    
    # Look for noun phrases that might be skills
    for chunk in doc.noun_chunks:
        phrase = chunk.text.strip()
        if len(phrase.split()) <= 4 and len(phrase) > 2:  # Reasonable length
            # Check if it matches any known skill patterns
            if is_technical_term(phrase):
                skills_found.append({
                    'skill': phrase,
                    'confidence': 0.6,  # Lower confidence for NLP-extracted
                    'mentions': 1,
                    'context': extract_context(text, phrase, 100),
                    'type': 'nlp_extracted'
                })
    
    return skills_found

def is_technical_term(phrase: str) -> bool:
    """Check if a phrase looks like a technical skill"""
    technical_indicators = [
        'programming', 'language', 'framework', 'library', 'database',
        'api', 'algorithm', 'system', 'network', 'security', 'cloud',
        'machine learning', 'data', 'analytics', 'testing', 'deployment'
    ]
    
    phrase_lower = phrase.lower()
    return any(indicator in phrase_lower for indicator in technical_indicators)

def extract_context(text: str, term: str, context_length: int = 100) -> str:
    """Extract context around a term in the text"""
    try:
        # Find the term (case-insensitive)
        pattern = re.compile(re.escape(term), re.IGNORECASE)
        match = pattern.search(text)
        
        if match:
            start = max(0, match.start() - context_length)
            end = min(len(text), match.end() + context_length)
            context = text[start:end]
            return f"...{context}..."
    except:
        pass
    
    return text[:200]  # Fallback to beginning of text

def infer_implicit_skills(text: str) -> List[Dict[str, Any]]:
    """Infer implicit skills from context and achievements"""
    implicit_skills = []
    
    # Leadership indicators
    if re.search(r'\b(led|managed|coordinated|directed|supervised|mentored)\b', text, re.IGNORECASE):
        implicit_skills.append({
            'skill': 'Leadership',
            'confidence': 0.7,
            'evidence': 'Found leadership action verbs',
            'type': 'inferred'
        })
    
    # Communication indicators
    if re.search(r'\b(presented|explained|collaborated|discussed|negotiated)\b', text, re.IGNORECASE):
        implicit_skills.append({
            'skill': 'Communication',
            'confidence': 0.6,
            'evidence': 'Found communication action verbs',
            'type': 'inferred'
        })
    
    # Problem solving indicators
    if re.search(r'\b(solved|optimized|improved|debugged|resolved|fixed)\b', text, re.IGNORECASE):
        implicit_skills.append({
            'skill': 'Problem Solving',
            'confidence': 0.65,
            'evidence': 'Found problem-solving action verbs',
            'type': 'inferred'
        })
    
    # Project management indicators
    if re.search(r'\b(project|timeline|deadline|milestone|deliverable)\b', text, re.IGNORECASE):
        implicit_skills.append({
            'skill': 'Project Management',
            'confidence': 0.6,
            'evidence': 'Found project management terminology',
            'type': 'inferred'
        })
    
    return implicit_skills
