#!/usr/bin/env python3
"""
Script de démarrage pour IndraOS Backend
"""

import uvicorn
from core.config import settings

if __name__ == "__main__":
    print("🚀 Démarrage d'IndraOS Backend...")
    print(f"📊 API: http://{settings.host}:{settings.port}")
    print(f"📚 Documentation: http://{settings.host}:{settings.port}/docs")
    print(f"🔍 Redoc: http://{settings.host}:{settings.port}/redoc")
    print(f"💚 Health Check: http://{settings.host}:{settings.port}/health")
    print("=" * 50)
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
