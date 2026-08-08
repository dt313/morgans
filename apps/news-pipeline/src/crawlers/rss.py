from datetime import UTC
from email.utils import parsedate_to_datetime

import feedparser

from src.crawlers.collector import Collector
from src.models import NewsSource
from src.schemas.crawl import RawRSSArticle


class RSSCollector(Collector):
    def __init__(self, source: NewsSource):
        self.source = source

    async def fetch(self) -> list[RawRSSArticle]:

        feed = feedparser.parse(self.source.rss_url)

        articles = []

        for item in feed.entries:
            content = (
                item.get("content", [{}])[0].get("value", "")
                if item.get("content")
                else ""
            )

            articles.append(
                RawRSSArticle(
                    title=item.get("title"),
                    url=item.get("link"),
                    descriptions=item.get("summary", ""),
                    content=content,
                    author=item.get("author", ""),
                    publisher=self.source.publisher,
                    category=self.source.category,
                    source_id=self.source.id,
                    thumbnail=self.extract_thumbnail(item),
                    published_at=self.parse_rss_date(item.get("published")),
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

    @staticmethod
    def parse_rss_date(date_str: str | None):

        if not date_str:
            return None

        try:
            dt = parsedate_to_datetime(date_str)
            if dt.tzinfo is not None:
                dt = dt.astimezone(UTC).replace(tzinfo=None)
            return dt

        except Exception:  # noqa: BLE001
            return None
