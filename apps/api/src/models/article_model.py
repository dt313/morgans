from enum import Enum

from sqlalchemy import String, Text, DateTime, func, Enum as SQLEnum, ForeignKey, Index

from sqlalchemy.orm import Mapped, mapped_column, relationship

from datetime import datetime

from src.db.base import Base


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

    title: Mapped[str] = mapped_column(String(500))

    url: Mapped[str] = mapped_column(unique=True)

    content: Mapped[str | None] = mapped_column(Text)

    summary: Mapped[str | None] = mapped_column(Text)

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
