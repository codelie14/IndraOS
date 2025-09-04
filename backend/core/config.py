from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # API Configuration
    api_title: str = "IndraOS API"
    api_version: str = "0.1.0"
    api_description: str = "API backend pour IndraOS - Système d'exploitation intelligent"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    
    # Database Configuration
    database_url: str = "sqlite:///./indraos.db"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "indraos.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()

# Environment variables override
if os.getenv("DEBUG"):
    settings.debug = os.getenv("DEBUG").lower() == "true"

if os.getenv("DATABASE_URL"):
    settings.database_url = os.getenv("DATABASE_URL")

if os.getenv("SECRET_KEY"):
    settings.secret_key = os.getenv("SECRET_KEY")
