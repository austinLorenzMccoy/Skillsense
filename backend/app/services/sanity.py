import os
import requests
from typing import List, Dict, Any
from .skill_ontology import get_local_skills

SANITY_PROJECT = os.getenv("SANITY_PROJECT")
SANITY_DATASET = os.getenv("SANITY_DATASET", "production")
SANITY_TOKEN = os.getenv("SANITY_TOKEN")

def is_sanity_available() -> bool:
    """Check if Sanity credentials are configured"""
    return all([SANITY_PROJECT, SANITY_TOKEN])

def query_skills(term: str = None) -> List[Dict[str, Any]]:
    """Query Sanity for skills, fallback to local if not available"""
    if not is_sanity_available():
        # Return local skills matching the term
        all_skills = get_local_skills()
        if term:
            matching = [s for s in all_skills if term.lower() in s.lower()]
            return [{"_id": f"local_{i}", "name": skill, "category": "hard"} for i, skill in enumerate(matching[:10])]
        else:
            return [{"_id": f"local_{i}", "name": skill, "category": "hard"} for i, skill in enumerate(all_skills[:20])]

    try:
        q = '*[_type == "skill"'
        if term:
            q += f' && name match "*{term}*"'
        q += '] { _id, name, category, synonyms }'

        resp = requests.post(
            f"https://{SANITY_PROJECT}.api.sanity.io/v2021-06-07/data/query/{SANITY_DATASET}",
            json={"query": q, "params": {"term": term} if term else {}}
        )
        resp.raise_for_status()
        return resp.json().get("result", [])
    except Exception as e:
        print(f"Sanity query failed: {e}, using local fallback")
        return query_skills(term)  # Recursive call to use local fallback
