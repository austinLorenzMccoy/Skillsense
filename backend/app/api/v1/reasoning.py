from fastapi import APIRouter
from app.core.schemas import SuggestBulletsRequest, SuggestBulletsResponse

router = APIRouter()

@router.post("/reasoning/suggest-bullets", response_model=SuggestBulletsResponse)
async def suggest_bullets(request: SuggestBulletsRequest):
    # Mock bullets
    bullets = [
        {
            "text": f"Developed {request.skillId} solutions using advanced techniques",
            "provenance": ["github", "cv"]
        }
    ]
    return SuggestBulletsResponse(
        bullets=bullets,
        promptUsed="Template-based generation"
    )
