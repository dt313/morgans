from fastapi import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from src.db.session import get_db
from src.core.dependencies import get_current_user
from src.services.user_service import user_service
from src.schemas.response import SuccessResponseModel
from src.schemas.user import UserResponse
from typing import List


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=SuccessResponseModel[List[UserResponse]])
async def get_users(
    db: AsyncSession = Depends(get_db),
    user: int = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    users = await user_service.get_users(db=db, skip=skip, limit=limit)
    print(f"Retrieved users: {user.user_id}")  # Debugging statement
    return SuccessResponseModel(message="Users retrieved successfully", data=users)
