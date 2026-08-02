from pydantic import BaseModel
from datetime import datetime


class RawRSSArticle(BaseModel):
    title: str

    url: str

    descriptions: str | None = None

    content: str | None = None

    thumbnail: str | None = None

    publisher: str

    author: str | None = None

    category: str | None = None

    source_id: int

    published_at: datetime | None = None
