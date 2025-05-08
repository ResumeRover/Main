import os
from pydantic_settings import BaseSettings
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Gateway settings
    API_PREFIX: str = "/api"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    PROJECT_NAME: str = "Resume Parser API Gateway"
    VERSION: str = "0.1.0"
    
    # CORS settings
    ALLOW_ORIGINS: List[str] = ["http://localhost:3000"]  # Add your frontend URL
    ALLOW_CREDENTIALS: bool = True
    ALLOW_METHODS: List[str] = ["*"]
    ALLOW_HEADERS: List[str] = ["*"]
    
    # Service URLs - in production these would come from service discovery
    AUTH_SERVICE_URL: str = os.getenv("AUTH_SERVICE_URL", "")
    UPLOAD_SERVICE_URL: str = os.getenv("UPLOAD_SERVICE_URL", "")
    PARSER_SERVICE_URL: str = os.getenv("PARSER_SERVICE_URL", "")
    DATA_SERVICE_URL: str = os.getenv("DATA_SERVICE_URL", "")
    JOBS_SERVICE_URL: str = os.getenv("JOBS_SERVICE_URL", "")
    SEARCH_SERVICE_URL: str = os.getenv("SEARCH_SERVICE_URL", "")
    USER_SERVICE_URL: str = os.getenv("USER_SERVICE_URL", "")
    
    # JWT settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM: str = "HS256"
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60  # Default: 60 requests per minute
    
    class Config:
        env_file = ".env"

settings = Settings()