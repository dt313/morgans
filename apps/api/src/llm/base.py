from abc import ABC, abstractmethod
from collections.abc import AsyncIterator
from typing_extensions import Literal


class LLMClient(ABC):
    @abstractmethod
    async def generate(
        self, prompt: str, response_format: Literal["json", "text"] = "json"
    ) -> str:
        pass

    @abstractmethod
    async def generate_stream(self, prompt: str) -> AsyncIterator[str]:
        pass
