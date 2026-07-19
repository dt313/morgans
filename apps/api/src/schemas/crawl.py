from pydantic import BaseModel


class RawRSSArticle(BaseModel):
    title: str

    url: str

    content: str | None = None

    thumbnail: str | None = None

    publisher: str

    category: str | None = None

    source_id: int
