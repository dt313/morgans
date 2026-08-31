from fastapi import APIRouter

from src.routes.health_router import router as health_router
from src.routes.app_info_router import router as app_info
from src.routes.auth_router import router as auth_router
from src.routes.article_router import router as article_router
from src.routes.user_router import router as user_router
from src.routes.chat_router import router as chat_router

api_router = APIRouter(prefix="/api/v1", tags=["API"])

api_router.include_router(health_router)
api_router.include_router(app_info)
api_router.include_router(auth_router)
api_router.include_router(article_router)
api_router.include_router(user_router)
api_router.include_router(chat_router)
