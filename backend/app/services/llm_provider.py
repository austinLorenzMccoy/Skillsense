import os
from abc import ABC, abstractmethod
from typing import List, Dict, Any
import re
import spacy

# Load spaCy model for local processing
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None

class LLMProvider(ABC):
    @abstractmethod
    def infer_implicit_skills(self, documents: List[str]) -> List[Dict]:
        pass

    @abstractmethod
    def generate_cv_bullets(self, evidence: List[Dict], tone: str) -> List[str]:
        pass

class OpenAIProvider(LLMProvider):
    def __init__(self):
        import openai
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def infer_implicit_skills(self, documents: List[str]) -> List[Dict]:
        # OpenAI implementation would go here
        return []

    def generate_cv_bullets(self, evidence: List[Dict], tone: str) -> List[str]:
        # OpenAI implementation would go here
        return []

class LocalProvider(LLMProvider):
    def infer_implicit_skills(self, documents: List[str]) -> List[Dict]:
        """Simple rule-based inference using spaCy"""
        if not nlp:
            return []

        implicit_skills = []
        for doc in documents:
            doc_obj = nlp(doc.lower())

            # Simple patterns for implicit skills
            patterns = {
                "leadership": ["led", "managed", "coordinated", "directed"],
                "communication": ["presented", "explained", "collaborated", "discussed"],
                "problem_solving": ["solved", "optimized", "improved", "debugged"],
                "mentoring": ["mentored", "trained", "taught", "guided"]
            }

            for skill, keywords in patterns.items():
                if any(keyword in doc.lower() for keyword in keywords):
                    implicit_skills.append({
                        "skill": skill,
                        "confidence": 0.6,
                        "source": "inferred",
                        "evidence": f"Found keywords: {', '.join(keywords)}"
                    })

        return implicit_skills

    def generate_cv_bullets(self, evidence: List[Dict], tone: str) -> List[str]:
        """Generate CV bullets using template-based approach"""
        bullets = []

        for item in evidence[:3]:  # Limit to 3 bullets
            snippet = item.get("snippet", "").strip()

            # Extract action verbs and objects using simple regex
            action_patterns = [
                r"(?:developed|built|created|designed|implemented)\s+(.+?)(?:\s+using|\s+with|\s+for|\.|\n|$)",
                r"(?:led|managed|coordinated)\s+(.+?)(?:\s+team|\s+project|\.|\n|$)",
                r"(?:improved|optimized|enhanced)\s+(.+?)(?:\s+by|\.|\n|$)"
            ]

            bullet = None
            for pattern in action_patterns:
                match = re.search(pattern, snippet, re.IGNORECASE)
                if match:
                    action = match.group(0).strip()
                    bullet = f"• {action.capitalize()}"
                    break

            if not bullet:
                # Fallback: use first sentence
                sentences = snippet.split('.')
                if sentences:
                    bullet = f"• {sentences[0].strip().capitalize()}"

            if bullet:
                bullets.append(bullet)

        return bullets if bullets else ["• Contributed to project development and implementation"]

def get_llm_provider() -> LLMProvider:
    """Factory function to get appropriate LLM provider"""
    if os.getenv("OPENAI_API_KEY"):
        try:
            return OpenAIProvider()
        except ImportError:
            pass

    return LocalProvider()
