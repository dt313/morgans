from src.repositories.user_repository import user_repo
from sqlalchemy.ext.asyncio import AsyncSession
from src.schemas.user import UserResponse


class UserService:
    async def get_users(self, db: AsyncSession, skip: int = 0, limit: int = 100):
        users = await user_repo.get_users(db=db, skip=skip, limit=limit)

        return [UserResponse.model_validate(user) for user in users]


user_service = UserService()
