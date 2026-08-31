from src.core.config import settings
from src.llm.ollama_client import OllamaClient
from src.llm.deepseek_client import DeepSeekClient


def get_llm():

    if settings.LLM_PROVIDER == "ollama":
        return OllamaClient(model=settings.LLM_MODEL)
    elif settings.LLM_PROVIDER == "deepseek":
        return DeepSeekClient(
            model=settings.LLM_MODEL, api_key=settings.DEEPSEEK_API_KEY
        )

    raise ValueError("Unsupported LLM provider")
