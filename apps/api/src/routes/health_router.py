from src.core.exceptions import AppException
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.constants.response import ResponseCode, ResponseMessages
from src.schemas.response import SuccessResponseModel
from src.db.session import get_db

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/")
async def health(db: AsyncSession = Depends(get_db)):
    try:
        # Perform a basic query to check the DB connection
        await db.execute(text("SELECT 1"))
        return SuccessResponseModel(
            message=ResponseMessages.HEALTH_CHECK_SUCCESS,
            data={"status": "healthy", "database": "connected"},
        )
    except Exception as e:
        print(f"Database connection failed: {e}")
        raise AppException(
            message=ResponseMessages.HEALTH_CHECK_FAILED,
            status_code=500,
            code=ResponseCode.APP_ERROR,
            details=str(e),
        ) from e
