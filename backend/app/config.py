from pydantic_settings import BaseSettings
from typing import List, Optional
import os
import sys
import logging

logger = logging.getLogger("pashuraksha.config")

class Settings(BaseSettings):
    PROJECT_NAME: str = "PASHURAKSHA AI"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # DEMO_MODE toggle: defaults to False. When True, allows controlled demo personas.
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "false").strip().lower() in ("true", "1", "yes")

    # JWT Security Configuration
    # Production MUST provide SECRET_KEY via environment.
    _raw_secret: Optional[str] = os.getenv("SECRET_KEY")
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 Hours

    # Database URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # Comma-separated CORS origins or list
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Additional CORS origins from environment (comma-separated)
    EXTRA_CORS_ORIGINS: str = ""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        raw_secret = os.getenv("SECRET_KEY", "").strip()
        env = self.ENVIRONMENT.lower()

        if not self.DEMO_MODE:
            if not raw_secret or "pashuraksha-super-secret" in raw_secret or "dev-insecure" in raw_secret:
                raise RuntimeError(
                    "FATAL SECURITY CONFIGURATION ERROR: When DEMO_MODE=false, SECRET_KEY environment variable "
                    "must be explicitly set to a secure unique random string. Refusing to start."
                )
            self.SECRET_KEY = raw_secret
        else:
            # Development / Demo mode fallback with explicit warning
            if raw_secret:
                self.SECRET_KEY = raw_secret
            else:
                self.SECRET_KEY = "dev-insecure-key-pashuraksha-sih2026-demo-only"
                logger.warning(
                    "[SECURITY WARNING] DEMO_MODE=true and no SECRET_KEY set. Using demo-only development key."
                )

    @property
    def all_cors_origins(self) -> List[str]:
        """Combine default CORS_ORIGINS with any extra origins from env."""
        origins = list(self.CORS_ORIGINS)
        if self.EXTRA_CORS_ORIGINS:
            extras = [o.strip() for o in self.EXTRA_CORS_ORIGINS.split(",") if o.strip()]
            origins.extend(extras)
        return origins

    class Config:
        # Resolve .env relative to the backend directory (parent of app/)
        # This ensures it works whether CWD is project root or backend/
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
        case_sensitive = True

settings = Settings()
