from sqlalchemy import text

from src.core.logger import get_logger
from src.db.session import AsyncSessionLocal

logger = get_logger(__name__)


async def test_connection():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text("SELECT 1"))
        logger.info("Connected to database successfully: %s", result.scalar())
