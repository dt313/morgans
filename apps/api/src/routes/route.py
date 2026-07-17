from fastapi import APIRouter

from src.routes.health import router as health_router
from src.routes.app_info import router as app_info


api_router = APIRouter(prefix="/api/v1", tags=["API"])

api_router.include_router(health_router)
api_router.include_router(app_info)
