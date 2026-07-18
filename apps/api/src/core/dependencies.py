from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from src.core.security import verify_token
from src.core.exceptions import UnauthorizedException

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    auto_error=False,  # Disable automatic error handling
)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
):

    if not token:
        raise UnauthorizedException(message="Missing access token")

    payload = verify_token(token, "access")

    return payload.user
