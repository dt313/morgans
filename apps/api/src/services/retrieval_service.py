from sqlalchemy.ext.asyncio import AsyncSession

from src.core.embedding_client import embedding_client
from src.repositories.article_repository import article_repo
from src.services.time_filter import TimeFilter


class RetrievalService:
    async def search(
        self,
        db: AsyncSession,
        query: str,
        limit: int = 5,
        time_filter: TimeFilter | None = None,
        max_distance: float | None = 0.7,
    ):
        query_embedding = await embedding_client.embed(query)

        if not query_embedding:
            return []

        return await article_repo.search_similar(
            db=db,
            embedding=query_embedding,
            limit=limit,
            published_from=time_filter.start if time_filter else None,
            published_to=time_filter.end if time_filter else None,
            max_distance=max_distance,
        )


retrieval_service = RetrievalService()
