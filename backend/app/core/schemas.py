from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from uuid import UUID

class IngestRequest(BaseModel):
    urls: Optional[List[str]] = None
    options: Optional[Dict[str, Any]] = None

class IngestResponse(BaseModel):
    jobId: str
    estimatedSeconds: int

class JobStatus(BaseModel):
    jobId: str
    status: str
    progress: int
    message: str

class EvidenceSchema(BaseModel):
    id: str
    sourceType: str
    snippet: str
    sourceUrl: Optional[str] = None
    weight: float

class SkillSchema(BaseModel):
    id: str
    name: str
    type: str
    confidence: float
    evidence: List[EvidenceSchema]
    related: List[str]

class ProfileResponse(BaseModel):
    profileId: str
    name: Optional[str] = None
    summary: Optional[str] = None
    topSkills: List[Dict[str, Any]]
    skills: List[SkillSchema]
    graph: Dict[str, Any]
    personaScores: Dict[str, float]

class SuggestBulletsRequest(BaseModel):
    profileId: str
    skillId: str
    tone: str

class BulletResponse(BaseModel):
    text: str
    provenance: List[str]

class SuggestBulletsResponse(BaseModel):
    bullets: List[BulletResponse]
    promptUsed: str

class ExportRequest(BaseModel):
    profileId: str
    formatOptions: Optional[Dict[str, Any]] = None

class ExportResponse(BaseModel):
    pdfUrl: str
