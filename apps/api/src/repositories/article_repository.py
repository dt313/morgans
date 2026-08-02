from sqlalchemy import desc, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.article_model import Article, ArticleStatus


class ArticleRepository:
    async def get_published_articles(
        self, db: AsyncSession, skip: int = 0, limit: int = 20
    ) -> list[Article]:
        result = await db.execute(
            select(Article)
            .where(Article.status == ArticleStatus.PUBLISHED)
            .order_by(desc(Article.published_at).nulls_last(), desc(Article.id))
            .offset(skip)
            .limit(limit)
        )

        return list(result.scalars().all())

    async def find_existing_urls(self, db: AsyncSession, urls: list[str]) -> set[str]:

        result = await db.execute(select(Article.url).where(Article.url.in_(urls)))

        return set(result.scalars().all())

    async def bulk_create(self, db: AsyncSession, articles: list[dict]):

        article_objects = [Article(**article) for article in articles]

        db.add_all(article_objects)

        await db.commit()

        return article_objects

    async def get_pending_articles(self, db: AsyncSession):
        result = await db.execute(
            select(Article)
            .where(Article.content.is_not(None), Article.status == ArticleStatus.DRAFT)
            .order_by(Article.published_at)
        )

        return list(result.scalars().all())

    async def update_summary(
        self,
        db: AsyncSession,
        article_id: int,
        korean_summary: str | None = None,
        vietnamese_summary: str | None = None,
        topics: str | None = None,
        status: ArticleStatus = ArticleStatus.PUBLISHED,
    ):
        await db.execute(
            update(Article)
            .where(Article.id == article_id)
            .values(
                korean_summary=korean_summary,
                vietnamese_summary=vietnamese_summary,
                topics=topics,
                status=status,
            )
        )

        await db.commit()


article_repo = ArticleRepository()
