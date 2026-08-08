from src.core.logger import get_logger
from src.db.session import engine
from src.models import Article, NewsSource  # noqa: F401

from .base import Base

logger = get_logger(__name__)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully.")
        logger.info("Tables: %s", sorted(Base.metadata.tables.keys()))
