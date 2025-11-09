"""
AI Career Coach API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.core.auth import get_current_user
from app.services.career_coach import get_career_advice

router = APIRouter()

class SkillInput(BaseModel):
    name: str
    confidence: Optional[float] = 0

class CareerAdviceRequest(BaseModel):
    skills: List[SkillInput]
    advice_type: str = "gap_analysis"
    target_role: Optional[str] = "Senior Developer"
    skill_name: Optional[str] = None
    location: Optional[str] = "United States"
    job_title: Optional[str] = "Software Engineer"

@router.post("/coach/advice")
async def get_advice(
    request: CareerAdviceRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Get AI-powered career advice
    
    Types:
    - gap_analysis: Analyze skill gaps for target role
    - learning_path: Get learning path for a skill
    - salary: Get salary insights
    - interview: Get interview preparation
    - daily: Get daily career tip
    """
    skills = [{"name": s.name, "confidence": s.confidence} for s in request.skills]
    
    kwargs = {
        "target_role": request.target_role,
        "skill_name": request.skill_name,
        "location": request.location,
        "job_title": request.job_title
    }
    
    result = get_career_advice(skills, request.advice_type, **kwargs)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return result

@router.get("/coach/daily-tip")
async def get_daily_tip(current_user: dict = Depends(get_current_user)):
    """Get daily career tip (requires user skills from profile)"""
    # In production, fetch user's actual skills from database
    sample_skills = [
        {"name": "Python", "confidence": 85},
        {"name": "React", "confidence": 75}
    ]
    
    result = get_career_advice(sample_skills, "daily")
    return result
