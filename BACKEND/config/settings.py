import os
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """
    Centralized application settings with automatic validation.
    
    All environment variables are validated at startup.
    Missing required variables will raise a clear error.
    """

    def __init__(self):
        # Required - External Services
        self.GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
        self.MONGO_URI = os.getenv("MONGO_URI", "")

        # CORS Configuration
        self.ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")

        # File Upload Settings
        self.MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10 * 1024 * 1024))
        self.ALLOWED_EXTENSIONS = os.getenv("ALLOWED_EXTENSIONS", "pdf,doc,docx")

        # AI Settings
        self.AI_MODEL = os.getenv("AI_MODEL", "llama-3.3-70b-versatile")
        self.AI_MAX_TOKENS = int(os.getenv("AI_MAX_TOKENS", 4000))
        self.AI_TEMPERATURE = float(os.getenv("AI_TEMPERATURE", 0.1))
        self.CV_TEXT_MAX_LENGTH = int(os.getenv("CV_TEXT_MAX_LENGTH", 8000))

        # Application Info
        self.APP_NAME = os.getenv("APP_NAME", "Hirevion")
        self.APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
        self.APP_DESCRIPTION = os.getenv("APP_DESCRIPTION", "AI-powered recruitment and talent matching platform")

    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse ALLOWED_ORIGINS string into a list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def allowed_extensions_set(self) -> set:
        """Parse ALLOWED_EXTENSIONS string into a set with dots."""
        return {f".{ext.strip().lower()}" for ext in self.ALLOWED_EXTENSIONS.split(",") if ext.strip()}

    def validate_mongo_uri(self) -> None:
        """Validate MongoDB URI is properly configured."""
        if "YOUR_PASSWORD" in self.MONGO_URI or "<password>" in self.MONGO_URI.lower():
            raise ValueError(
                "MONGO_URI contains placeholder password. "
                "Please update your .env file with your actual MongoDB password."
            )

    def validate_groq_key(self) -> None:
        """Validate Groq API key is properly configured."""
        if "your_groq_api_key" in self.GROQ_API_KEY.lower():
            raise ValueError(
                "GROQ_API_KEY contains placeholder value. "
                "Please update your .env file with your actual Groq API key."
            )

    def validate_all(self) -> None:
        """Run all custom validations."""
        self.validate_mongo_uri()
        self.validate_groq_key()


# Global settings instance
settings = Settings()
