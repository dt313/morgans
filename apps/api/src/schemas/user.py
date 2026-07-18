from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
