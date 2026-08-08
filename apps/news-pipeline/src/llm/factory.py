from src.core.config import settings
from src.llm.ollama_client import OllamaClient


def get_llm():

    if settings.LLM_PROVIDER == "ollama":
        return OllamaClient(model=settings.LLM_MODEL)

    raise ValueError("Unsupported LLM provider")
