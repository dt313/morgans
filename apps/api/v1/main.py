from fastapi import FastAPI

app = FastAPI(
    title="News AI API",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {"message": "News AI API is running"}


@app.get("/health")
async def health():
    return {"status": "ok"}
