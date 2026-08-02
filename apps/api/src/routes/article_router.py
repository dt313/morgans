from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.schemas.article import ArticleResponse
from src.schemas.response import SuccessResponseModel
from src.services.article_service import article_service


router = APIRouter(prefix="/articles", tags=["Articles"])


@router.get("/", response_model=SuccessResponseModel[list[ArticleResponse]])
async def get_articles(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    articles = await article_service.get_published_articles(
        db=db, skip=skip, limit=limit
    )
    return SuccessResponseModel(
        message="Articles retrieved successfully", data=articles
    )
