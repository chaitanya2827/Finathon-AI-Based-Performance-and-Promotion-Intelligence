"""
Application configuration for ZEROBUGS HRM-05 backend.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory of the repository
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load environment variables from .env if present
load_dotenv(BASE_DIR / ".env")


class Settings:
    PROJECT_NAME: str = "ZEROBUGS — AI-Based Performance & Promotion Intelligence"
    PROJECT_CODE: str = "HRM-05"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")

    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))

    # AI and Intelligence Engine Configuration
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "offline")

    # CORS settings for frontend integration (configurable via environment variable)
    CORS_ORIGINS: list[str] = (
        [origin.strip() for origin in os.getenv("CORS_ORIGINS", "").split(",") if origin.strip()]
        if os.getenv("CORS_ORIGINS")
        else [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8080",
            "http://127.0.0.1:8080",
        ]
    )

    # Data paths
    SEED_DATA_PATH: Path = BASE_DIR / "data" / "seed_data.json"
    SYNTHETIC_DATA_PATH: Path = BASE_DIR / "data" / "synthetic_hr_data.json"
    DATABASE_PATH: Path = BASE_DIR / "backend" / "app" / "database" / "zerobugs.db"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'backend' / 'app' / 'database' / 'zerobugs.db'}")

    # ElevenLabs Voice Configuration
    ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
    ELEVENLABS_VOICE_ID: str = os.getenv("ELEVENLABS_VOICE_ID", "")
    ELEVENLABS_MODEL_ID: str = os.getenv("ELEVENLABS_MODEL_ID", "eleven_flash_v2_5")

    # Audio storage directory
    AUDIO_DIR: Path = BASE_DIR / "backend" / "generated_audio"


settings = Settings()
settings.AUDIO_DIR.mkdir(parents=True, exist_ok=True)
