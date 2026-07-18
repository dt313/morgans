from typing_extensions import Literal

from src.constants.response import ResponseCode
from src.core.exceptions import AppException, UnauthorizedException
from fastapi import status
import bcrypt
from datetime import datetime, timedelta, timezone
from jose import ExpiredSignatureError, JWTError, jwt
from src.core.config import settings
from src.schemas.auth import TokenPayload

ALGORITHM = "HS256"
TokenType = Literal["access", "refresh"]


def hash_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


def create_token(data: str, type: TokenType = "access") -> str:
    to_encode = data.copy()

    if type == "access":
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        secret_key = settings.ACCESS_SECRET_KEY
    else:
        expires_delta = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
        secret_key = settings.REFRESH_SECRET_KEY

    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire, "type": type})

    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)


def verify_token(token: str, type: TokenType = "access") -> TokenPayload:
    secret_key = (
        settings.ACCESS_SECRET_KEY if type == "access" else settings.REFRESH_SECRET_KEY
    )

    try:
        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])

    except ExpiredSignatureError as e:
        raise AppException(
            f"{type.capitalize()} Token has expired",
            status_code=status.HTTP_401_UNAUTHORIZED,
            code=ResponseCode.EXPIRED_ACCESS_TOKEN
            if type == "access"
            else ResponseCode.EXPIRED_REFRESH_TOKEN,
            details=str(e),
        )

    except JWTError as e:
        raise AppException(
            "Could not validate credentials ",
            status_code=status.HTTP_401_UNAUTHORIZED,
            code=ResponseCode.INVALID_ACCESS_TOKEN
            if type == "access"
            else ResponseCode.INVALID_REFRESH_TOKEN,
            details=str(e),
        )

    if payload.get("type") != type:
        raise UnauthorizedException(
            "Could not validate credentials",
            details=f"Invalid token type, expected '{type}'",
        )

    return TokenPayload.model_validate(payload)
