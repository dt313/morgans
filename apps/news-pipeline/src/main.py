import argparse
import asyncio

from src.core.logger import get_logger, setup_logger
from src.db.init import init_db
from src.db.test_connection import test_connection
from src.scheduler import run_pipeline, start_scheduler

logger = get_logger(__name__)


async def main(once: bool = False):
    await test_connection()
    await init_db()

    if once:
        logger.info("Running pipeline once (no scheduler)")
        await run_pipeline()
        logger.info("Pipeline run finished")
        return

    start_scheduler()
    logger.info("News pipeline is running. Press Ctrl+C to stop.")
    await asyncio.Event().wait()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="News pipeline")
    parser.add_argument(
        "--once",
        action="store_true",
        help="Run the pipeline once and exit (skip scheduler)",
    )
    args = parser.parse_args()

    setup_logger()
    try:
        asyncio.run(main(once=args.once))
    except KeyboardInterrupt:
        logger.info("News pipeline stopped")
