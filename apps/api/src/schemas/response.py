from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

from src.constants.response import (
    ResponseCode,
    ResponseMessages,
)


T = TypeVar("T")


class SuccessResponseModel(BaseModel, Generic[T]):
    success: bool = True
    code: ResponseCode = ResponseCode.SUCCESS
    message: str = ResponseMessages.SUCCESS
    data: Optional[T] = None


class ErrorResponseModel(BaseModel):
    success: bool = False
    code: ResponseCode = ResponseCode.ERROR
    message: str = ResponseMessages.ERROR
    details: Optional[str] = None
