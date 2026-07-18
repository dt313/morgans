from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user_model import User
from src.repositories.user_repository import user_repo
from src.core.security import (
    create_token,
    hash_password,
    verify_password,
)
from src.core.exceptions import AppException
from src.schemas.auth import TokenUser


class AuthService:
    async def register(
        self,
        db: AsyncSession,
        email: str,
        password: str,
    ):

        existing = await user_repo.find_by_email(db, email)

        if existing:
            raise AppException(
                message="Email already exists",
                status_code=400,
                code="EMAIL_EXISTS",
            )

        user = User(
            email=email,
            password=hash_password(password),
        )

        return await user_repo.create(db, user)

    async def login(
        self,
        db: AsyncSession,
        email: str,
        password: str,
    ):

        user = await user_repo.find_by_email(db, email)

        if not user:
            raise AppException(
                message="Invalid credentials",
                status_code=401,
                code="INVALID_LOGIN",
            )

        if not verify_password(password, user.password):
            raise AppException(
                message="Invalid credentials",
                status_code=401,
                code="INVALID_LOGIN",
            )

        subject = TokenUser(
            user_id=user.id,
        )

        print("subject ", subject)

        access_token = create_token({"user": subject.model_dump()}, type="access")

        refresh_token = create_token({"user": subject.model_dump()}, type="refresh")

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }


auth_service = AuthService()
