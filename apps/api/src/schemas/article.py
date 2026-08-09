from datetime import datetime

from pydantic import BaseModel, ConfigDict

from src.models.article_model import ArticleStatus


class ArticleResponse(BaseModel):
    id: int
    source_id: int
    korean_title: str | None
    vietnamese_title: str | None
    url: str
    descriptions: str | None
    category: str | None
    publisher: str | None
    korean_summary: str | None
    vietnamese_summary: str | None
    topics: list[str] | None
    status: ArticleStatus
    thumbnail_url: str | None
    author: str | None
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
