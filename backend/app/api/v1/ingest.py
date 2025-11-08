from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from uuid import uuid4
from datetime import datetime
import json
from app.core.db import SessionLocal
from app.core.models import Job
from app.core.tasks import process_ingest_job
from app.core.schemas import IngestResponse

router = APIRouter()

@router.post("/ingest", response_model=IngestResponse)
async def ingest(
    file: UploadFile = File(None),
    urls: str = Form(None),
    options: str = Form("{}")
):
    job_id = uuid4()  # Generate UUID object
    
    # Parse options
    try:
        options_dict = json.loads(options) if options else {}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid options JSON")
    
    # Persist job
    db = SessionLocal()
    job = Job(
        id=job_id,  # Use UUID object
        status="queued",
        payload={"urls": urls, "options": options_dict},
        created_at=datetime.utcnow()
    )
    db.add(job)
    db.commit()
    
    # Save file temporarily if provided
    saved_path = None
    if file:
        saved_path = f"/tmp/{job_id}_{file.filename}"
        with open(saved_path, "wb") as f:
            f.write(await file.read())
    
    # Enqueue Celery task
    process_ingest_job.delay(str(job_id), saved_path, urls, options)  # Pass string to Celery
    
    db.close()
    return IngestResponse(jobId=str(job_id), estimatedSeconds=45)
