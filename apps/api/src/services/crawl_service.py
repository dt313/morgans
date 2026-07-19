from src.repositories.news_source_repository import news_source_repo
from src.db.session import AsyncSessionLocal
from src.crawlers.rss import RSSCollector


class CrawlService:
    async def rss_collect(self):
        async with AsyncSessionLocal() as db:
            sources = await news_source_repo.find_active_rss_sources(db=db)

            for source in sources:
                collector = RSSCollector(source)
                articles = await collector.fetch()

                if articles:
                    print(source.publisher, source.category, len(articles), articles[0])
                else:
                    print(source.publisher, source.category, "No articles")


crawl_service = CrawlService()
