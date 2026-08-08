import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "News pipeline"
    APP_ENV: str = os.getenv("APP_ENV", "dev")
    DEBUG: bool = True

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:123456@localhost:5555/news_dev",
    )

    LLM_PROVIDER: str = "ollama"
    LLM_MODEL: str = "gemma3:4b"
    LOG_LEVEL: str = "DEBUG"

    PIPELINE_ENABLED: bool = True
    PIPELINE_RUN_ON_START: bool = True
    PIPELINE_INTERVAL_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file=f".env.{APP_ENV}",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
