from enum import Enum


class ResponseMessages(str, Enum):
    SUCCESS = "Success"
    ERROR = "Error"

    # health
    HEALTH_CHECK_SUCCESS = "Health check successful"
    HEALTH_CHECK_FAILED = "Health check failed"

    # app
    APP_INFO_RETRIEVED = "App info retrieved"

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
    NOT_FOUND = "not_found"

    # Database
    DATABASE_ERROR = "database_error"

    # Auth
    UNAUTHORIZED = "unauthorized"
    INVALID_ACCESS_TOKEN = "invalid_access_token"
    EXPIRED_ACCESS_TOKEN = "expired_access_token"
    INVALID_REFRESH_TOKEN = "invalid_refresh_token"
    EXPIRED_REFRESH_TOKEN = "expired_refresh_token"
