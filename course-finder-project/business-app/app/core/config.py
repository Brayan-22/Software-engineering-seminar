from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Application settings using Pydantic BaseSettings.
    Automatically loads from .env file
    """
    # Application
    APP_NAME: str = "Business App"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
