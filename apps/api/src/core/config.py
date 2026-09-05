import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Morgans"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = True

    HOST: str = "127.0.0.1"
    PORT: int = 8000

    DATABASE_URL: str

    ACCESS_SECRET_KEY: str
    REFRESH_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 10080

    LLM_PROVIDER: str = "ollama"
    LLM_MODEL: str = "gemma3:4b"
    LOG_LEVEL: str = "DEBUG"

    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_MODEL_ID: str = "eleven_v3"
    KOREAN_VOICE_ID: str = "JBFqnCBsd6RMkjVDRZzb"
    VIETNAMESE_VOICE_ID: str = "5vqV9IG7sDpzgzKOIZAv"
    ELEVENLABS_FALLBACK_VOICE_ID: str = "JBFqnCBsd6RMkjVDRZzb"
    ELEVENLABS_OUTPUT_FORMAT: str = "mp3_44100_128"
    AUDIO_CACHE_DIR: str = "static/audio"

    OLLAMA_BASE_URL: str = "http://localhost:11434"
    EMBEDDING_MODEL: str = "bgpt:3b"

    DEEPSEEK_API_KEY: str = "api_key_here"
    model_config = SettingsConfigDict(
        env_file=f".env.{APP_ENV}",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
