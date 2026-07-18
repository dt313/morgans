import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "News API"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = True

    HOST: str = "127.0.0.1"
    PORT: int = 8000

    DATABASE_URL: str

    ACCESS_SECRET_KEY: str
    REFRESH_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 10080

    LOG_LEVEL: str = "DEBUG"

    model_config = SettingsConfigDict(
        env_file=f".env.{APP_ENV}",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
