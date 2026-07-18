from fastapi import FastAPI
from sqlalchemy.sql import text
from fastapi.responses import JSONResponse
from urllib.request import Request
from src.core.logger import setup_logger, get_logger
from src.core.exceptions import AppException
from src.db.init import init_db
from contextlib import asynccontextmanager
from src.routes import api_router
from src.core.config import settings
from src.db.session import engine

setup_logger()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger = get_logger(__name__)
    logger.info(f"{settings.APP_NAME} is starting up")
    logger.info(f"Database URL: {settings.DATABASE_URL}")
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            logger.info("Database connected")

            await init_db()
            logger.info("Tables initialized")

    except Exception as e:
        logger.error(f"Database failed: {e}")

    yield

    logger.info(f"{settings.APP_NAME} is shutting down")
    await engine.dispose()


app = FastAPI(
    title="News AI API",
    version="0.1.0",
    lifespan=lifespan,
)


@app.exception_handler(AppException)
async def app_exception_handler(
    request: Request,
    exc: AppException,
):

    logger.error(
        f"Handling AppException: {exc.message}, Code: {exc.code}, Status: {exc.status_code}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "code": exc.code,
            "message": exc.message,
            "details": exc.details,
        },
    )


app.include_router(api_router)
