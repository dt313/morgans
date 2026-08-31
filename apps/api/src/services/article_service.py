from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.article_repository import article_repo


class ArticleService:
    async def get_published_article(self, db: AsyncSession, article_id: int):
        return await article_repo.get_published_article(db, article_id)

    async def get_published_articles(
        self, db: AsyncSession, skip: int = 0, limit: int = 20
    ):
        return await article_repo.get_published_articles(db, skip=skip, limit=limit)

    async def get_categories(self, db: AsyncSession):
        return await article_repo.get_categories(db)

    async def get_published_articles_by_category(
        self, db: AsyncSession, category: str, skip: int = 0, limit: int = 20
    ):
        return await article_repo.get_published_articles_by_category(
            db, category=category, skip=skip, limit=limit
        )

    async def get_related_articles(self, db: AsyncSession, article, limit: int = 6):
        return await article_repo.get_related_articles(db, article=article, limit=limit)

    async def search_articles(
        self, db: AsyncSession, query: str, skip: int = 0, limit: int = 20
    ):
        return await article_repo.search_articles(
            db, query=query, skip=skip, limit=limit
        )

    async def get_trending_topics(self, db: AsyncSession, limit: int = 10):
        since = datetime.utcnow() - timedelta(days=7)
        return await article_repo.get_trending_topics(db, limit=limit, since=since)


article_service = ArticleService()
