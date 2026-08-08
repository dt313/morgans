from abc import ABC, abstractmethod

from src.schemas.crawl import RawRSSArticle


class Collector(ABC):
    @abstractmethod
    async def fetch(self) -> list[RawRSSArticle]:
        """
        Collect raw news data
        """
