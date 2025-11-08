import os
from typing import List

# Local skill ontology fallback when Sanity is not available
LOCAL_SKILL_ONTOLOGY = {
    "hard": [
        "Python", "JavaScript", "Java", "C++", "C#", "Go", "Rust", "TypeScript",
        "React", "Vue.js", "Angular", "Node.js", "Django", "Flask", "FastAPI",
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes",
        "AWS", "Azure", "GCP", "Linux", "Git", "REST APIs", "GraphQL"
    ],
    "soft": [
        "Leadership", "Communication", "Problem Solving", "Teamwork",
        "Project Management", "Agile", "Scrum", "Mentoring", "Teaching"
    ],
    "emerging": [
        "Machine Learning", "AI", "Data Science", "Blockchain", "Web3",
        "IoT", "AR/VR", "Quantum Computing", "Edge Computing"
    ]
}

def get_local_skills() -> List[str]:
    """Get all skills from local ontology"""
    all_skills = []
    for category in LOCAL_SKILL_ONTOLOGY.values():
        all_skills.extend(category)
    return all_skills

def get_skills_by_type(skill_type: str) -> List[str]:
    """Get skills by type (hard, soft, emerging)"""
    return LOCAL_SKILL_ONTOLOGY.get(skill_type, [])

def normalize_skill(skill: str) -> str:
    """Simple normalization - in real app, this would use more sophisticated matching"""
    return skill.lower().strip()
