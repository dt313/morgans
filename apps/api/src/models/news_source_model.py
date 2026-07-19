from datetime import datetime

from sqlalchemy import String, Text, Boolean, Float, DateTime

from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base


class NewsSource(Base):
    __tablename__ = "news_sources"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    publisher: Mapped[str] = mapped_column(String(100))
    """
    SBS, Yonhap, KBS...
    """

    category: Mapped[str | None] = mapped_column(String(50), nullable=True)
    """
    politics, economy, sports...
    """

    rss_url: Mapped[str] = mapped_column(Text, unique=True)

    language: Mapped[str] = mapped_column(String(10), default="ko")

    country: Mapped[str] = mapped_column(String(10), default="KR")

    reliability_score: Mapped[float] = mapped_column(Float, default=0.5)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    last_crawled_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    last_article_published_at: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    articles = relationship("Article", back_populates="source")
