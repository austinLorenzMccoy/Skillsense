import os
import json
import uuid
from celery import Celery
from app.core.db import SessionLocal
from app.core.models import Job, Profile, Skill, Evidence
from app.services.parser import parse_file, fetch_urls_text
from app.services.extractor import extract_explicit_skills, infer_implicit_skills
from app.services.embeddings import embed_text, upsert_embedding, cosine_similarity, get_skill_embeddings
from app.services.skill_ontology import get_local_skills
from app.services.llm_provider import get_llm_provider

celery = Celery(__name__, broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"))

@celery.task(bind=True)
def process_ingest_job(self, job_id, file_path, urls_json, options_json):
    db = SessionLocal()
    job = db.query(Job).get(job_id)
    if not job:
        print(f"Job {job_id} not found")
        return
    
    try:
        job.status = "parsing"
        db.commit()
        
        # Parse inputs
        texts = []
        if file_path and os.path.exists(file_path):
            text = parse_file(file_path)
            texts.append(("cv", text))
        
        if urls_json:
            try:
                urls = json.loads(urls_json)
                for url in urls:
                    text = fetch_urls_text([url])
                    texts.append((url, text))
            except json.JSONDecodeError:
                print("Invalid URLs JSON")
        
        job.status = "extracting"
        db.commit()
        
        # Extract skills from all texts
        all_explicit_skills = []
        all_implicit_skills = []
        
        for source, text in texts:
            explicit = extract_explicit_skills(text)
            implicit = infer_implicit_skills(text)
            all_explicit_skills.extend(explicit)
            all_implicit_skills.extend(implicit)
        
        job.status = "inferring"
        db.commit()
        
        # Use LLM provider for additional inference
        llm_provider = get_llm_provider()
        combined_text = " ".join([text for _, text in texts])
        llm_inferred = llm_provider.infer_implicit_skills([combined_text])
        all_implicit_skills.extend(llm_inferred)
        
        job.status = "scoring"
        db.commit()
        
        # Create profile
        profile = Profile(
            id=uuid.uuid4(),
            name="Analyzed Profile",
            summary=f"Profile with {len(all_explicit_skills)} explicit and {len(all_implicit_skills)} implicit skills",
            source_manifest={"sources": [source for source, _ in texts]},
            top_skills=json.dumps([{
                "name": skill.get("skill", ""),
                "confidence": skill.get("confidence", 0.5)
            } for skill in (all_explicit_skills + all_implicit_skills)[:5]])
        )
        db.add(profile)
        
        # Create skills and evidence
        skill_embeddings = get_skill_embeddings()
        
        for skill_data in all_explicit_skills + all_implicit_skills:
            skill_name = skill_data.get("skill", "")
            if not skill_name:
                continue
            
            # Find or create skill
            skill = db.query(Skill).filter(Skill.name == skill_name).first()
            if not skill:
                skill = Skill(
                    id=uuid.uuid4(),
                    name=skill_name,
                    type=skill_data.get("type", "hard")[:4]  # Limit to enum values
                )
                db.add(skill)
            
            # Create evidence
            evidence = Evidence(
                id=uuid.uuid4(),
                profile_id=profile.id,
                skill_id=skill.id,
                source_type=skill_data.get("type", "cv")[:20],  # Limit length
                snippet=skill_data.get("context", "")[:500],  # Limit length
                confidence_weight=skill_data.get("confidence", 0.5)
            )
            db.add(evidence)
            
            # Store embedding for evidence
            upsert_embedding(
                str(evidence.id),
                skill_data.get("context", skill_name),
                {"skill": skill_name, "profile_id": str(profile.id)}
            )
        
        job.profile_id = profile.id
        job.status = "done"
        db.commit()
        
    except Exception as e:
        print(f"Error processing job {job_id}: {e}")
        job.status = "error"
        job.error = str(e)
        db.commit()
        raise
    finally:
        db.close()
