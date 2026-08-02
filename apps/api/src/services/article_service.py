import traceback
from src.crawlers.utils.summarize import llm_summarize
from src.repositories.article_repository import article_repo
import asyncio
from src.db.session import AsyncSessionLocal
from src.models.article_model import ArticleStatus
from sqlalchemy.ext.asyncio import AsyncSession

REQUEST_NUMBER = 5


class ArticleService:
    async def get_published_articles(
        self, db: AsyncSession, skip: int = 0, limit: int = 20
    ):
        return await article_repo.get_published_articles(db, skip=skip, limit=limit)

    async def update_summarize(self):
        async with AsyncSessionLocal() as db:
            articles = await article_repo.get_pending_articles(db=db)

            print(f"Found {len(articles)} articles to summarize")

            semaphore = asyncio.Semaphore(REQUEST_NUMBER)

            async def process(article):

                if not article.content:
                    return

                async with semaphore:
                    try:
                        print(f"Processing article {article.id}")

                        result = await llm_summarize.summarize(content=article.content)

                        print(f"Result for article {article.id}: {result}")

                        await article_repo.update_summary(
                            db=db,
                            article_id=article.id,
                            korean_summary=result["korean_summary"],
                            vietnamese_summary=result["vietnamese_summary"],
                            topics=result.get("topics", []),
                            status=ArticleStatus.PUBLISHED,
                        )

                        print(f"Completed article {article.id}")

                    except Exception as e:
                        print(f"Failed article {article.id}: {e}")
                        traceback.print_exc()

            await asyncio.gather(*(process(article) for article in articles))


article_service = ArticleService()
