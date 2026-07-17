from enum import Enum


class ResponseMessages(str, Enum):
    SUCCESS = "Success"
    ERROR = "Error"

    # health
    HEALTH_CHECK_SUCCESS = "Health check successful"
    HEALTH_CHECK_FAILED = "Health check failed"

    # News
    NEWS_CREATED = "News created successfully"
    NEWS_UPDATED = "News updated successfully"
    NEWS_DELETED = "News deleted successfully"
    NEWS_NOT_FOUND = "News not found"

    # Database
    DATABASE_ERROR = "Database error"

    # Auth
    UNAUTHORIZED = "Unauthorized"
    FORBIDDEN = "Forbidden"


class ResponseCode(str, Enum):
    SUCCESS = "success"
    ERROR = "error"

    # App
    APP_INFO_RETRIEVED = "app_info_retrieved"
    APP_ERROR = "app_error"

    # Health
    HEALTH_CHECK_SUCCESS = "health_check_success"

    # News
    NEWS_CREATED = "news_created"
    NEWS_NOT_FOUND = "news_not_found"

    # Database
    DATABASE_ERROR = "database_error"
