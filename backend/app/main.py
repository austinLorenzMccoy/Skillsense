from fastapi import FastAPI
from app.api.v1 import ingest, profile, reasoning

app = FastAPI(title="SkillSense API")

app.include_router(ingest.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")
app.include_router(reasoning.router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "ok"}
