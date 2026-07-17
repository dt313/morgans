from fastapi import FastAPI
from sqlalchemy.sql import text
from fastapi.responses import JSONResponse
from urllib.request import Request
from src.core.exceptions import AppException
from src.db.init import init_db
from contextlib import asynccontextmanager
from src.routes.route import api_router
from src.core.config import settings
from src.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"{settings.APP_NAME} is starting up")
    print(f"Database URL: {settings.DATABASE_URL}")

    print(f"Settings: {settings}")
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            print("Database connected")

            await init_db()
            print("Tables initialized")

    except Exception as e:
        print(f"Database failed: {e}")

    yield

    print(f"{settings.APP_NAME} is shutting down")
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
