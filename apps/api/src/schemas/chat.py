from datetime import datetime

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class ChatSource(BaseModel):
    id: int
    title: str
    url: str
    published_at: datetime | None


class ChatResponse(BaseModel):
    answer: str
    sources: list[ChatSource]
