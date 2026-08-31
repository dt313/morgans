from datetime import datetime

from sqlalchemy import desc, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.models.article_model import Article, ArticleStatus
from src.models.news_source_model import NewsSource


class ArticleRepository:
    async def get_published_article(
        self, db: AsyncSession, article_id: int
    ) -> Article | None:
        result = await db.execute(
            select(Article)
            .options(selectinload(Article.news_source))
            .where(
                Article.id == article_id,
                Article.status == ArticleStatus.PUBLISHED,
            )
        )
        return result.scalar_one_or_none()

    async def get_published_articles(
        self, db: AsyncSession, skip: int = 0, limit: int = 20
    ) -> list[Article]:
        result = await db.execute(
            select(Article)
            .options(selectinload(Article.news_source))
            .where(Article.status == ArticleStatus.PUBLISHED)
            .order_by(desc(Article.published_at).nulls_last(), desc(Article.id))
            .offset(skip)
            .limit(limit)
        )

        return list(result.scalars().all())

    async def get_related_articles(
        self,
        db: AsyncSession,
        article: Article,
        limit: int = 6,
    ) -> list[Article]:
        query = (
            select(Article)
            .options(selectinload(Article.news_source))
            .join(NewsSource, Article.source_id == NewsSource.id)
            .where(
                Article.status == ArticleStatus.PUBLISHED,
                Article.id != article.id,
            )
        )

        if article.category:
            query = query.where(NewsSource.category == article.category)

        query = query.order_by(
            desc(Article.published_at).nulls_last(), desc(Article.id)
        ).limit(max(limit * 4, 20))

        candidates = list((await db.execute(query)).scalars().all())

        article_topics = set(article.topics or [])

        ranked = sorted(
            candidates,
            key=lambda a: (
                len(article_topics & set(a.topics or [])),
                a.published_at or datetime.min,
                a.id,
            ),
            reverse=True,
        )

        return ranked[:limit]

    async def get_categories(self, db: AsyncSession) -> list[str]:
        result = await db.execute(
            select(NewsSource.category)
            .join(Article, Article.source_id == NewsSource.id)
            .where(
                NewsSource.category.is_not(None),
                Article.status == ArticleStatus.PUBLISHED,
            )
            .distinct()
            .order_by(NewsSource.category)
        )

        return [c for c in result.scalars().all() if c is not None]

    async def get_trending_topics(
        self,
        db: AsyncSession,
        limit: int = 10,
        since: datetime | None = None,
    ) -> list[tuple[str, int]]:
        topic = func.unnest(Article.topics).label("topic")
        count = func.count(Article.id).label("count")

        query = (
            select(topic, count)
            .where(
                Article.status == ArticleStatus.PUBLISHED,
                Article.topics.is_not(None),
            )
            .group_by(topic)
            .order_by(desc(count), desc(func.max(Article.published_at)))
            .limit(limit)
        )

        if since is not None:
            query = query.where(Article.published_at >= since)

        result = await db.execute(query)
        return [(row.topic, row.count) for row in result.all()]

    async def get_published_articles_by_category(
        self,
        db: AsyncSession,
        category: str,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Article]:
        result = await db.execute(
            select(Article)
            .options(selectinload(Article.news_source))
            .join(NewsSource, Article.source_id == NewsSource.id)
            .where(
                Article.status == ArticleStatus.PUBLISHED,
                NewsSource.category == category,
            )
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

    async def search_articles(
        self,
        db: AsyncSession,
        query: str,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Article]:
        pattern = f"%{query}%"
        result = await db.execute(
            select(Article)
            .options(selectinload(Article.news_source))
            .where(
                Article.status == ArticleStatus.PUBLISHED,
                or_(
                    Article.korean_title.ilike(pattern),
                    Article.vietnamese_title.ilike(pattern),
                    Article.author.ilike(pattern),
                    Article.content.ilike(pattern),
                    Article.korean_summary.ilike(pattern),
                    Article.vietnamese_summary.ilike(pattern),
                ),
            )
            .order_by(desc(Article.published_at).nulls_last(), desc(Article.id))
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def search_similar(
        self,
        db: AsyncSession,
        embedding: list[float],
        limit: int = 5,
    ):
        distance = Article.embedding.cosine_distance(embedding)

        result = await db.execute(
            select(Article)
            .where(
                Article.status == ArticleStatus.PUBLISHED,
                Article.embedding.is_not(None),
            )
            .order_by(distance)
            .limit(limit)
        )

        return list(result.scalars().all())


article_repo = ArticleRepository()
