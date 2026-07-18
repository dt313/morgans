from pydantic import BaseModel, EmailStr
from typing import Literal


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenUser(BaseModel):
    user_id: int


class TokenPayload(BaseModel):
    user: TokenUser
    exp: int
    type: Literal["access", "refresh"]
