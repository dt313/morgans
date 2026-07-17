from .base import Base
from src.db.session import engine


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("Database tables created successfully.")
        print(Base.metadata.tables.keys())
