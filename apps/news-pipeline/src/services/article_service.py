import asyncio

from src.core.logger import get_logger
from src.crawlers.utils.summarize import llm_summarize
from src.db.session import AsyncSessionLocal
from src.models.article_model import ArticleStatus
from src.repositories.article_repository import article_repo

logger = get_logger(__name__)

REQUEST_NUMBER = 5


class ArticleService:
    async def update_summarize(self):
        async with AsyncSessionLocal() as db:
            articles = await article_repo.get_pending_articles(db=db)

            logger.info("Found %s articles to summarize", len(articles))

            semaphore = asyncio.Semaphore(REQUEST_NUMBER)

            async def process(article):
                if not article.content:
                    return

                async with semaphore:
                    try:
                        logger.info("Processing article %s", article.id)

                        result = await llm_summarize.summarize(content=article.content)

                        await article_repo.update_summary(
                            db=db,
                            article_id=article.id,
                            korean_summary=result["korean_summary"],
                            vietnamese_summary=result["vietnamese_summary"],
                            topics=result.get("topics", []),
                            status=ArticleStatus.PUBLISHED,
                        )

                        logger.info("Completed article %s", article.id)

                    except Exception:
                        logger.exception("Failed article %s", article.id)

            await asyncio.gather(*(process(article) for article in articles))


article_service = ArticleService()
