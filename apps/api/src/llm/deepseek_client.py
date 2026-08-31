import json

import httpx

from collections.abc import AsyncIterator
from src.core.logger import get_logger
from src.llm.base import LLMClient
from typing import Literal

logger = get_logger(__name__)


class DeepSeekClient(LLMClient):
    def __init__(
        self,
        model: str = "deepseek-v4-flash",
        api_key: str = "",
    ):
        self.model = model
        self.api_key = api_key
        self.url = "https://api.deepseek.com/chat/completions"

    async def generate(
        self, prompt: str, response_format: Literal["json", "text"] = "json"
    ) -> str:
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
            logger.debug("DeepSeek model: %s", self.model)

            payload = {
                "model": self.model,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                "stream": False,
                "temperature": 0,
            }

            if response_format == "json":
                payload["response_format"] = {"type": "json_object"}

            response = await client.post(
                self.url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )

            response.raise_for_status()

            data = response.json()

            return data["choices"][0]["message"]["content"]

    async def generate_stream(self, prompt: str) -> AsyncIterator[str]:
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
            logger.debug("DeepSeek stream model: %s", self.model)

            payload = {
                "model": self.model,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                "stream": True,
                "temperature": 0,
            }

            async with client.stream(
                "POST",
                self.url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    data_str = line[len("data: ") :]
                    if data_str.strip() == "[DONE]":
                        break
                    try:
                        data = json.loads(data_str)
                        delta = data["choices"][0].get("delta", {})
                        content = delta.get("content")
                        if content:
                            yield content
                    except (json.JSONDecodeError, KeyError, IndexError):
                        continue
