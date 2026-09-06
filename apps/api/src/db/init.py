from .base import Base
from src.db.session import engine
from src.core.logger import get_logger
from sqlalchemy import text

logger = get_logger(__name__)


async def init_db():
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully.")
        print(Base.metadata.tables.keys())
