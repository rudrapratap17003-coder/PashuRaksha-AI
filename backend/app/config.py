from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "PASHURAKSHA AI"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    
    # JWT Security Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "pashuraksha-super-secret-jwt-key-sih2026-secure-token-998877")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 Hours
    
    # Comma-separated CORS origins or list
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Additional CORS origins from environment (comma-separated)
    EXTRA_CORS_ORIGINS: str = ""
    
    @property
    def all_cors_origins(self) -> List[str]:
        """Combine default CORS_ORIGINS with any extra origins from env."""
        origins = list(self.CORS_ORIGINS)
        if self.EXTRA_CORS_ORIGINS:
            extras = [o.strip() for o in self.EXTRA_CORS_ORIGINS.split(",") if o.strip()]
            origins.extend(extras)
        return origins
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
