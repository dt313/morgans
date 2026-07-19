from abc import ABC, abstractmethod


class Collector(ABC):
    @abstractmethod
    async def fetch(self):
        """
        Collect raw news data
        """
        pass
