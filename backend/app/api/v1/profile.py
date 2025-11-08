from fastapi import APIRouter, HTTPException
from app.core.db import SessionLocal
from app.core.models import Job, Profile, Skill, Evidence
from app.core.schemas import JobStatus, ProfileResponse, EvidenceSchema, SkillSchema
import json
from uuid import UUID

router = APIRouter()

@router.get("/status/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str):
    db = SessionLocal()
    try:
        try:
            job_uuid = UUID(job_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid job ID format")
            
        job = db.query(Job).filter(Job.id == job_uuid).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        progress_map = {
            "queued": 0,
            "parsing": 25,
            "extracting": 50,
            "inferring": 75,
            "scoring": 90,
            "done": 100,
            "error": -1
        }
        
        return JobStatus(
            jobId=job_id,
            status=job.status,
            progress=progress_map.get(job.status, 0),
            message=f"Processing job: {job.status}"
        )
    finally:
        db.close()

@router.get("/profile/{job_id}", response_model=ProfileResponse)
async def get_profile(job_id: str):
    db = SessionLocal()
    try:
        try:
            job_uuid = UUID(job_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid job ID format")
            
        job = db.query(Job).filter(Job.id == job_uuid).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        if job.status != "done":
            raise HTTPException(status_code=202, detail="Profile not ready yet")
        
        if not job.profile_id:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile = db.query(Profile).filter(Profile.id == job.profile_id).first()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Get skills and evidence
        skills_data = []
        evidence_list = db.query(Evidence).filter(Evidence.profile_id == profile.id).all()
        
        # Group evidence by skill
        skill_evidence_map = {}
        for ev in evidence_list:
            skill = db.query(Skill).filter(Skill.id == ev.skill_id).first()
            if skill:
                if skill.id not in skill_evidence_map:
                    skill_evidence_map[skill.id] = {
                        'skill': skill,
                        'evidence': []
                    }
                skill_evidence_map[skill.id]['evidence'].append(ev)
        
        # Build skills response
        for skill_id, data in skill_evidence_map.items():
            skill = data['skill']
            evidence_items = data['evidence']
            
            evidence_schemas = [
                EvidenceSchema(
                    id=str(ev.id),
                    sourceType=ev.source_type,
                    snippet=ev.snippet,
                    sourceUrl=ev.source_url,
                    weight=ev.confidence_weight
                ) for ev in evidence_items
            ]
            
            # Calculate overall confidence
            avg_confidence = sum(ev.confidence_weight for ev in evidence_items) / len(evidence_items)
            
            skills_data.append(SkillSchema(
                id=str(skill.id),
                name=skill.name,
                type=skill.type,
                confidence=round(avg_confidence, 2),
                evidence=evidence_schemas,
                related=[]  # Would be populated with related skills
            ))
        
        # Parse top skills
        try:
            top_skills = json.loads(profile.top_skills or "[]")
        except:
            top_skills = []
        
        return ProfileResponse(
            profileId=str(profile.id),
            name=profile.name,
            summary=profile.summary,
            topSkills=top_skills,
            skills=skills_data,
            graph={"nodes": [], "edges": []},  # Would be populated with graph data
            personaScores={"developer": 0.8, "product": 0.2}  # Would be calculated
        )
    finally:
        db.close()

@router.delete("/profile/{profile_id}")
async def delete_profile(profile_id: str):
    # Implement deletion logic
    return {"message": "Profile deleted"}
