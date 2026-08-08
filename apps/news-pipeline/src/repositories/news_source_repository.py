from datetime import datetime

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import NewsSource


class NewsSourceRepository:
    async def find_active_rss_sources(
        self,
        db: AsyncSession,
    ):
        result = await db.execute(
            select(NewsSource).where(NewsSource.is_active.is_(True))
        )

        return result.scalars().all()

    async def update_last_published_at(
        self, db: AsyncSession, source_id: int, published_at: datetime
    ):
        await db.execute(
            update(NewsSource)
            .where(NewsSource.id == source_id)
            .values(last_article_published_at=published_at)
        )
        await db.commit()


news_source_repo = NewsSourceRepository()
