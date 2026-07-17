from fastapi import APIRouter

from src.constants.response import ResponseMessages
from src.schemas.response import SuccessResponseModel
from src.core.config import settings

router = APIRouter(prefix="/app-info", tags=["App Info"])


@router.get("/")
async def get_info():
    return SuccessResponseModel(
        message=ResponseMessages.APP_INFO_RETRIEVED,
        data={"app_name": settings.APP_NAME, "app_env": settings.APP_ENV},
    )
