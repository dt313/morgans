from sqlalchemy.ext.asyncio import AsyncSession

from src.core.embedding_client import embedding_client
from src.repositories.article_repository import article_repo


class RetrievalService:
    async def search(
        self,
        db: AsyncSession,
        query: str,
        limit: int = 5,
    ):
        query_embedding = await embedding_client.embed(query)

        if not query_embedding:
            return []

        return await article_repo.search_similar(
            db=db,
            embedding=query_embedding,
            limit=limit,
        )


retrieval_service = RetrievalService()
