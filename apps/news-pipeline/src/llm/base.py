from abc import ABC, abstractmethod
from typing_extensions import Literal


class LLMClient(ABC):
    @abstractmethod
    async def generate(self, prompt: str, response_format: Literal["json", "text"] = "json") -> str:
        pass
