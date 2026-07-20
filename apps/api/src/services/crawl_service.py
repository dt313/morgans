from src.repositories.news_source_repository import news_source_repo
from src.db.session import AsyncSessionLocal
from src.crawlers.rss import RSSCollector
from typing import List
from src.schemas.crawl import RawRSSArticle
from src.repositories.article_repository import article_repo
from datetime import datetime


class CrawlService:
    async def rss_collect(self):
        async with AsyncSessionLocal() as db:
            sources = await news_source_repo.find_active_rss_sources(db=db)

            fetched_articles: List[RawRSSArticle] = []
            latest_published_at_by_source: dict[int, datetime] = {}

            for source in sources:
                collector = RSSCollector(source)
                articles = await collector.fetch()

                if not articles:
                    continue
                if source.last_article_published_at:
                    articles = [
                        article
                        for article in articles
                        if (
                            article.published_at
                            and article.published_at > source.last_article_published_at
                        )
                    ]
                if articles:
                    fetched_articles.extend(articles)
                    max_published_at = max(
                        a.published_at for a in articles if a.published_at
                    )

                    latest_published_at_by_source[source.id] = max_published_at

            print("Fetched Articles Length : ", len(fetched_articles))

            unique_articles = self.remove_duplicate_by_url(fetched_articles)

            urls = [article.url for article in unique_articles]

            # remove duplicate DB
            exists_urls = await article_repo.find_existing_urls(db, urls)

            new_articles = [
                article for article in unique_articles if article.url not in exists_urls
            ]

            print("After duplicate remove", len(new_articles))

            data = [
                {
                    "source_id": a.source_id,
                    "title": a.title,
                    "url": a.url,
                    "content": a.content,
                    "thumbnail_url": a.thumbnail,
                    "published_at": a.published_at,
                }
                for a in new_articles
            ]

            if data:
                # store article to DB
                await article_repo.bulk_create(db, data)

            for source_id, max_published_at in latest_published_at_by_source.items():
                await news_source_repo.update_last_published_at(
                    db=db, source_id=source_id, published_at=max_published_at
                )

    @staticmethod
    def remove_duplicate_by_url(articles: List[RawRSSArticle]) -> List[RawRSSArticle]:
        unique = {}
        for article in articles:
            if article.url not in unique:
                unique[article.url] = article

        return list(unique.values())


crawl_service = CrawlService()
