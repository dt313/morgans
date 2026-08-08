import logging

from rich.logging import RichHandler

from src.core.config import settings


def setup_logger():
    logging.basicConfig(
        level=settings.LOG_LEVEL,
        format=("%(asctime)s | %(levelname)s | %(name)s | %(message)s"),
        handlers=[RichHandler(rich_tracebacks=True)],
    )


def get_logger(name: str):
    return logging.getLogger(name)
