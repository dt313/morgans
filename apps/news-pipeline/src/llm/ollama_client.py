

import httpx

from typing import Literal
from src.core.logger import get_logger
from src.llm.base import LLMClient

logger = get_logger(__name__)


class OllamaClient(LLMClient):
    def __init__(
        self,
        model: str = "qwen3:4b",
    ):
        self.model = model
        self.url = "http://localhost:11434/api/generate"

    async def generate(self, prompt: str, response_format: Literal["json", "text"] = "json") -> str:

        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
            logger.debug("Ollama model: %s", self.model)

            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "think": False,
                "options": {
                    "temperature": 0,
                    "num_ctx": 4096,
                },
            }

            if response_format == "json":
                payload["format"] = "json"

            response = await client.post(
                self.url,
                json=payload,
            )

            response.raise_for_status()

            data = response.json()

            answer = data["response"]

            return answer
