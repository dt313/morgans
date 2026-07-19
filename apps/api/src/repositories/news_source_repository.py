from sqlalchemy import select
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


news_source_repo = NewsSourceRepository()
