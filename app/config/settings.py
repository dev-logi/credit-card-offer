"""Application settings using Pydantic Settings."""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings."""
    
    # App Info
    APP_NAME: str = "Credit Card Recommendation Service"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./credit_cards.db"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    CORS_CREDENTIALS: bool = True
    CORS_METHODS: List[str] = ["*"]
    CORS_HEADERS: List[str] = ["*"]
    
    # API
    API_PREFIX: str = ""
    
    # Recommendation Engine
    DEFAULT_TOP_N: int = 3
    DEFAULT_REFERENCE_AMOUNT: float = 100.0
    
    # Foursquare Places API
    FOURSQUARE_API_KEY: str = ""
    FOURSQUARE_DEFAULT_RADIUS: int = 5000  # meters
    FOURSQUARE_DEFAULT_LIMIT: int = 20
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

