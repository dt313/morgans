from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.article_repository import article_repo


class ArticleService:
    async def get_published_article(self, db: AsyncSession, article_id: int):
        return await article_repo.get_published_article(db, article_id)

    async def get_published_articles(
        self, db: AsyncSession, skip: int = 0, limit: int = 20
    ):
        return await article_repo.get_published_articles(db, skip=skip, limit=limit)


article_service = ArticleService()
