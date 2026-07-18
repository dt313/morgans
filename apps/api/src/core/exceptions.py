from typing import Optional
from src.constants.response import ResponseCode
from src.core.logger import get_logger

logger = get_logger(__name__)


class AppException(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = 400,
        code: ResponseCode = ResponseCode.APP_ERROR,
        details: Optional[str] = None,
    ):

        logger.error(f"{code}: {message}")
        self.message = message
        self.status_code = status_code
        self.code = code
        self.details = details

        super().__init__(message)


class DatabaseException(AppException):
    def __init__(self, message="Database error", details: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=500,
            code=ResponseCode.DATABASE_ERROR,
            details=details,
        )


class NotFoundException(AppException):
    def __init__(self, message="Resource not found", details: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=404,
            code=ResponseCode.NOT_FOUND,
            details=details,
        )


class UnauthorizedException(AppException):
    def __init__(self, message="Unauthorized", details: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=401,
            code=ResponseCode.UNAUTHORIZED,
            details=details,
        )
