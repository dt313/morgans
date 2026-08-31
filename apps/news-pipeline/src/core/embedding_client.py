import httpx

from src.core.config import settings


class EmbeddingClient:

    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model = settings.EMBEDDING_MODEL

    async def embed(self, text: str) -> list[float]:

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/embed",
                json={
                    "model": self.model,
                    "input": text,
                },
                timeout=120,
            )

            response.raise_for_status()

            data = response.json()

            return data["embeddings"][0]


embedding_client = EmbeddingClient()
