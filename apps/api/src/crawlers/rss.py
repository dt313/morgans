import feedparser

from src.crawlers.collector import Collector
from src.models import NewsSource
from src.schemas.crawl import RawRSSArticle
from typing import List


class RSSCollector(Collector):
    def __init__(self, source: NewsSource):
        self.source = source

    async def fetch(self) -> List[RawRSSArticle]:

        feed = feedparser.parse(self.source.rss_url)

        articles = []

        for item in feed.entries:
            articles.append(
                RawRSSArticle(
                    title=item.get("title"),
                    url=item.get("link"),
                    content=item.get("summary", ""),
                    publisher=self.source.publisher,
                    category=self.source.category,
                    source_id=self.source.id,
                    thumbnail=self.extract_thumbnail(item),
                )
            )

        return articles

    @staticmethod
    def extract_thumbnail(item) -> str | None:
        for link in item.get("links", []):
            if link.get("rel") == "enclosure" and link.get("type", "").startswith(
                "image/"
            ):
                return link.get("href")

        return None
