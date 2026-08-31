import asyncio

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from src.core.config import settings
from src.core.logger import get_logger
from src.services.article_service import article_service
from src.services.crawl_service import crawl_service
from src.services.article_embedding_service import article_embedding_service

logger = get_logger(__name__)

scheduler = AsyncIOScheduler(timezone="UTC")


async def run_pipeline():
    logger.info("Pipeline job started")
    try:
        await crawl_service.rss_collect()
        logger.info("RSS crawl completed")

        # await article_service.update_summarize()
        # logger.info("Article summarize completed")

        # await article_embedding_service.update_embeddings()
        # logger.info("Article embedding completed")

    except Exception:
        logger.exception("Pipeline job failed")
    logger.info("Pipeline job finished")


def start_scheduler():
    if not settings.PIPELINE_ENABLED:
        logger.info("Pipeline scheduler is disabled")
        return

    scheduler.add_job(
        run_pipeline,
        IntervalTrigger(minutes=settings.PIPELINE_INTERVAL_MINUTES),
        id="news_pipeline",
        replace_existing=True,
    )

    if settings.PIPELINE_RUN_ON_START:
        logger.info("Running pipeline once at startup")
        asyncio.get_running_loop().create_task(run_pipeline())

    scheduler.start()
    logger.info(
        "Scheduler started, running every %s minutes", settings.PIPELINE_INTERVAL_MINUTES
    )
