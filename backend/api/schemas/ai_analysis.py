from pydantic import BaseModel
from typing import List

class AIInsight(BaseModel):
    id: int
    category: str
    description: str
    recommendation: str
    severity: str

class AIAnalysisStats(BaseModel):
    insights_generated: int
    optimizations_applied: int
    security_issues_fixed: int
    performance_gain_percentage: float

class AIAnalysisStatus(BaseModel):
    system_scan_progress: float
    security_analysis_progress: float
    performance_check_progress: float
    optimization_scan_progress: float
    status_message: str

class AIAnalysisData(BaseModel):
    stats: AIAnalysisStats
    status: AIAnalysisStatus
    insights: List[AIInsight]

