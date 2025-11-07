from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os
from pathlib import Path

# Get the project root directory (business-src/)
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """
    Application settings using Pydantic BaseSettings.
    Loads configuration from .env file using python-dotenv
    """
    # Application
    APP_NAME: str = "Course Finder API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Pydantic v2 configuration
    model_config = SettingsConfigDict(
        env_file=os.path.join(BASE_DIR, ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# Global settings instance
settings = Settings()
