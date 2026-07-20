from pydantic import BaseModel
from datetime import datetime


class RawRSSArticle(BaseModel):
    title: str

    url: str

    content: str | None = None

    thumbnail: str | None = None

    publisher: str

    category: str | None = None

    source_id: int

    published_at: datetime | None = None
