from fastapi import APIRouter, Depends
from api.schemas.ai_analysis import AIAnalysisData
from services import ai_service

router = APIRouter()

@router.get("/ai-analysis", response_model=AIAnalysisData)
async def get_ai_analysis():
    """
    Retrieve AI-driven analysis of the system.
    """
    return ai_service.get_ai_analysis_data()
