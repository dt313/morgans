from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, ForeignKey, Index, String, Text, func
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base

from pgvector.sqlalchemy import Vector


class ArticleStatus(str, Enum):
    DRAFT = "draft"
    PROCESSING = "processing"
    PUBLISHED = "published"
    FAILED = "failed"
    ARCHIVED = "archived"


class Article(Base):
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True)

    source_id: Mapped[int] = mapped_column(ForeignKey("news_sources.id"))

    korean_title: Mapped[str] = mapped_column(
        String(500), nullable=False, default="")

    vietnamese_title: Mapped[str] = mapped_column(
        String(500), nullable=True, default="")

    url: Mapped[str] = mapped_column(unique=True)

    content: Mapped[str | None] = mapped_column(Text)

    korean_summary: Mapped[str | None] = mapped_column(Text)

    vietnamese_summary: Mapped[str | None] = mapped_column(Text)

    topics: Mapped[list[str] | None] = mapped_column(
        ARRAY(String), nullable=True)
    descriptions: Mapped[str | None] = mapped_column(String(700))

    status: Mapped[ArticleStatus] = mapped_column(
        SQLEnum(ArticleStatus), default=ArticleStatus.DRAFT, nullable=False
    )

    thumbnail_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    author: Mapped[str | None] = mapped_column(String(100), nullable=True)

    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    news_source = relationship("NewsSource", back_populates="articles")

    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(1024),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    __table_args__ = (Index("idx_article_published_at", "published_at"),)
