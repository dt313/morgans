from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.article_model import Article


class ArticleRepository:
    async def find_existing_urls(self, db: AsyncSession, urls: list[str]) -> set[str]:

        result = await db.execute(select(Article.url).where(Article.url.in_(urls)))

        return set(result.scalars().all())

    async def bulk_create(self, db: AsyncSession, articles: list[dict]):

        article_objects = [Article(**article) for article in articles]

        db.add_all(article_objects)

        await db.commit()

        return article_objects


article_repo = ArticleRepository()
