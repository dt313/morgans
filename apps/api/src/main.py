import os

from fastapi import FastAPI

app = FastAPI(
    title="News AI API",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {
        "message": "News AI API is running on FastAPI! PORT "
        + os.environ.get("PORT", "8000")
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
