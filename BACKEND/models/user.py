from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user model with common fields."""
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(default="user", pattern="^(user|recruiter|admin)$")


class UserCreate(UserBase):
    """Model for user registration."""
    password: str = Field(..., min_length=6, max_length=128)


class UserLogin(BaseModel):
    """Model for user login."""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Model for user response (without password)."""
    id: str
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Model for authentication token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenRefresh(BaseModel):
    """Model for token refresh request."""
    refresh_token: str


class UserInDB(UserBase):
    """Internal user model stored in database."""
    hashed_password: str
    id: Optional[str] = None
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    is_active: bool = True
