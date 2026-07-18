from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
)
from src.services.auth_service import auth_service
from src.schemas.response import SuccessResponseModel

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/register",
    response_model=UserResponse,
)
async def register(
    body: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):

    return await auth_service.register(
        db,
        body.email,
        body.password,
    )


@router.post(
    "/login",
    response_model=SuccessResponseModel[TokenResponse],
)
async def login(
    body: LoginRequest,
    db: AsyncSession = Depends(get_db),
):

    token_pair = await auth_service.login(
        db,
        body.email,
        body.password,
    )

    print(f"Token pair: {token_pair}")

    return SuccessResponseModel(
        message="Login successful",
        data=token_pair,
    )
