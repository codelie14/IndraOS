from typing import List
from api.schemas.ai_analysis import AIAnalysisData, AIAnalysisStats, AIAnalysisStatus, AIInsight

def get_ai_analysis_data() -> AIAnalysisData:
    """
    Generates mock AI analysis data.
    In a real application, this would involve running complex AI models.
    """
    mock_insights = [
        AIInsight(
            id=1,
            category="Performance",
            description="High CPU usage detected in 'explorer.exe' process.",
            recommendation="Consider closing unused applications or tabs to reduce CPU load.",
            severity="Medium"
        ),
        AIInsight(
            id=2,
            category="Security",
            description="Unusual outbound network traffic detected from a non-standard application.",
            recommendation="Review the application in the firewall settings and run a security scan.",
            severity="High"
        ),
        AIInsight(
            id=3,
            category="Optimization",
            description="Several large temporary files found in the system cache.",
            recommendation="Use the system cleanup utility to free up disk space.",
            severity="Low"
        ),
        AIInsight(
            id=4,
            category="Performance",
            description="Memory usage is consistently above 85%.",
            recommendation="Upgrade RAM or configure virtual memory for better performance.",
            severity="Medium"
        ),
    ]

    mock_stats = AIAnalysisStats(
        insights_generated=47,
        optimizations_applied=23,
        security_issues_fixed=5,
        performance_gain_percentage=15.0
    )

    mock_status = AIAnalysisStatus(
        system_scan_progress=100.0,
        security_analysis_progress=87.0,
        performance_check_progress=65.0,
        optimization_scan_progress=23.0,
        status_message="Neural networks are actively monitoring your system. Next full analysis scheduled in 2 hours."
    )

    return AIAnalysisData(
        stats=mock_stats,
        status=mock_status,
        insights=mock_insights
    )
