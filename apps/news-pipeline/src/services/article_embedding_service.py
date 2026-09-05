import asyncio

from src.core.logger import get_logger
from src.db.session import AsyncSessionLocal
from src.repositories.article_repository import article_repo
from src.core.embedding_client import embedding_client

logger = get_logger(__name__)

REQUEST_NUMBER = 5


class ArticleEmbeddingService:

    async def update_embeddings(self):
        async with AsyncSessionLocal() as db:
            articles = await article_repo.get_pending_embeddings(db=db)

            logger.info(
                "Found %s articles to embed",
                len(articles),
            )

            semaphore = asyncio.Semaphore(REQUEST_NUMBER)

            async def process(article):
                async with semaphore:
                    try:
                        logger.info(
                            "Processing embedding for article %s",
                            article.id,
                        )

                        text = self._build_embedding_text(article)

                        embedding = await embedding_client.embed(text)

                        if not embedding:
                            logger.warning(
                                "Article %s skipped: no embedding generated",
                                article.id,
                            )
                            return

                        await article_repo.update_embedding(
                            db=db,
                            article_id=article.id,
                            embedding=embedding,
                        )

                        logger.info(
                            "Completed embedding article %s",
                            article.id,
                        )

                    except Exception:
                        logger.exception(
                            "Failed embedding article %s",
                            article.id,
                        )

            await asyncio.gather(
                *(process(article) for article in articles)
            )

    @staticmethod
    def _build_embedding_text(article) -> str:
        topics = ", ".join(article.topics or [])

        return f"""
                Title:
                {article.korean_title}

                Summary:
                {article.korean_summary}

                Topics:
                {topics}
                """.strip()


article_embedding_service = ArticleEmbeddingService()
