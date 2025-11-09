from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.auth import router as auth_router
from app.api.v1.ingest import router as ingest_router
from app.api.v1.profile import router as profile_router
from app.api.v1.reasoning import router as reasoning_router
from app.api.v1.coach import router as coach_router
from app.api.v1.admin import router as admin_router
from app.core.db import engine
from app.core.models import Base

# Initialize database tables on startup
try:
    print("🔄 Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables initialized successfully!")
except Exception as e:
    print(f"⚠️  Database initialization warning: {e}")

app = FastAPI(
    title="SkillSense API",
    description="AI-powered talent discovery and skill analysis platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:3000",
        "https://skillsense-hacknation.netlify.app",
        "https://skillsense.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# API routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(ingest_router, prefix="/api/v1", tags=["ingest"])
app.include_router(profile_router, prefix="/api/v1", tags=["profile"])
app.include_router(reasoning_router, prefix="/api/v1", tags=["reasoning"])
app.include_router(coach_router, prefix="/api/v1", tags=["career-coach"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["admin"])

@app.get("/")
async def root():
    return {"message": "Welcome to SkillSense API", "docs": "/docs"}
