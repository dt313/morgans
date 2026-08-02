import httpx

from src.llm.base import LLMClient


class OllamaClient(LLMClient):
    def __init__(
        self,
        model: str = "qwen3:4b",
    ):
        self.model = model
        self.url = "http://localhost:11434/api/generate"

    async def generate(self, prompt: str) -> str:

        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
            print("================ Model ================")
            print(self.model)
            print("===========================================")

            response = await client.post(
                self.url,
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json",
                    "think": False,
                    "options": {"temperature": 0, "num_ctx": 4096},
                },
            )

            response.raise_for_status()

            data = response.json()

            return data["response"]
