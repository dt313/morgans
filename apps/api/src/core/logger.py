import logging
import sys

from rich.logging import RichHandler
from src.core.config import settings


def setup_rich_logger():

    logging.basicConfig(
        level=settings.LOG_LEVEL,
        format=("%(asctime)s | %(levelname)s | %(name)s | %(message)s"),
        handlers=[RichHandler(rich_tracebacks=True)],
    )


def setup_json_logger():
    logging.basicConfig(
        level=settings.LOG_LEVEL,
        format=("%(asctime)s | %(levelname)s | %(name)s | %(message)s"),
        handlers=[logging.StreamHandler(sys.stdout)],
    )


def setup_logger():
    if settings.APP_ENV == "dev":
        setup_rich_logger()
    else:
        setup_json_logger()


def get_logger(name: str):

    return logging.getLogger(name)
