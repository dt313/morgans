from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.article_model import Article, ArticleStatus


class ArticleRepository:
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

    async def get_pending_embeddings(self, db: AsyncSession):
        result = await db.execute(
            select(Article)
            .where(
                Article.korean_summary.is_not(None),
                Article.topics.is_not(None),
                Article.korean_title.is_not(None),
                Article.embedding.is_(None),
                Article.status == ArticleStatus.PROCESSING,
            )
            .order_by(Article.published_at)
        )

        return list(result.scalars().all())

    async def update_summary(
        self,
        db: AsyncSession,
        article_id: int,
        vietnamese_title: str | None = None,
        korean_summary: str | None = None,
        vietnamese_summary: str | None = None,
        topics: list[str] | None = None,
        status: ArticleStatus = ArticleStatus.PUBLISHED,
    ):
        await db.execute(
            update(Article)
            .where(Article.id == article_id)
            .values(
                vietnamese_title=vietnamese_title,
                korean_summary=korean_summary,
                vietnamese_summary=vietnamese_summary,
                topics=topics,
                status=status,
            )
        )

        await db.commit()

    async def update_embedding(
        self,
        db: AsyncSession,
        article_id: int,
        embedding: list[float],
    ):
        await db.execute(
            update(Article)
            .where(Article.id == article_id)
            .values(embedding=embedding, status=ArticleStatus.PUBLISHED)
        )

        await db.commit()


article_repo = ArticleRepository()
