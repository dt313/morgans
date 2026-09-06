from fastapi import APIRouter, Depends, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.exceptions import NotFoundException
from src.db.session import get_db
from src.schemas.article import ArticleResponse
from src.schemas.response import SuccessResponseModel
from src.services.article_service import article_service
from src.services.tts_service import tts_service


router = APIRouter(prefix="/articles", tags=["Articles"])


class TrendingTopic(BaseModel):
    topic: str
    count: int


@router.get("/categories", response_model=SuccessResponseModel[list[str]])
async def get_categories(db: AsyncSession = Depends(get_db)):
    categories = await article_service.get_categories(db=db)
    return SuccessResponseModel(
        message="Categories retrieved successfully", data=categories
    )


@router.get("/trending", response_model=SuccessResponseModel[list[TrendingTopic]])
async def get_trending_topics(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(default=10, ge=1, le=50),
):
    topics = await article_service.get_trending_topics(db=db, limit=limit)
    data = [TrendingTopic(topic=t, count=c) for t, c in topics]
    return SuccessResponseModel(
        message="Trending topics retrieved successfully", data=data
    )


@router.get("", response_model=SuccessResponseModel[list[ArticleResponse]])
@router.get("/", response_model=SuccessResponseModel[list[ArticleResponse]], include_in_schema=False)
async def get_articles(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    category: str | None = Query(default=None),
):
    if category:
        articles = await article_service.get_published_articles_by_category(
            db=db, category=category, skip=skip, limit=limit
        )
    else:
        articles = await article_service.get_published_articles(
            db=db, skip=skip, limit=limit
        )
    return SuccessResponseModel(
        message="Articles retrieved successfully", data=articles
    )


@router.get("/search", response_model=SuccessResponseModel[list[ArticleResponse]])
async def search_articles(
    q: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    articles = await article_service.search_articles(
        db=db, query=q, skip=skip, limit=limit
    )
    return SuccessResponseModel(message="Articles searched successfully", data=articles)


@router.get("/{article_id}", response_model=SuccessResponseModel[ArticleResponse])
async def get_article(article_id: int, db: AsyncSession = Depends(get_db)):
    article = await article_service.get_published_article(db=db, article_id=article_id)
    if article is None:
        raise NotFoundException(message="Article not found")

    return SuccessResponseModel(message="Article retrieved successfully", data=article)


@router.get(
    "/{article_id}/related",
    response_model=SuccessResponseModel[list[ArticleResponse]],
)
async def get_related_articles(
    article_id: int,
    db: AsyncSession = Depends(get_db),
    limit: int = Query(default=6, ge=1, le=20),
):
    article = await article_service.get_published_article(db=db, article_id=article_id)
    if article is None:
        raise NotFoundException(message="Article not found")

    related = await article_service.get_related_articles(
        db=db, article=article, limit=limit
    )
    return SuccessResponseModel(
        message="Related articles retrieved successfully", data=related
    )


@router.get("/{article_id}/audio")
async def get_article_audio(
    article_id: int,
    db: AsyncSession = Depends(get_db),
    language: str = Query(default="ko", pattern="^(ko|vi)$"),
):
    article = await article_service.get_published_article(db=db, article_id=article_id)
    if article is None:
        raise NotFoundException(message="Article not found")

    text = article.korean_summary if language == "ko" else article.vietnamese_summary
    if not text:
        raise NotFoundException(message="Audio summary not available for this language")

    path = await tts_service.generate_audio(
        article_id=article_id, language=language, text=text
    )
    return FileResponse(
        path,
        media_type="audio/mpeg",
        filename=f"article_{article_id}_{language}.mp3",
    )
