from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from enum import Enum
from datetime import datetime, timezone

class UserRole(str, Enum):
    FARMER = "farmer"
    FIELD_WORKER = "field_worker"
    VETERINARIAN = "veterinarian"
    LABORATORY = "laboratory"
    AUTHORITY = "authority"
    ADMIN = "admin"

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    phone: str = Field(..., min_length=5, max_length=20)
    email: EmailStr = Field(...)
    role: UserRole = Field(default=UserRole.FARMER)
    village: Optional[str] = Field(None, max_length=255)
    district: Optional[str] = Field(None, max_length=255)
    state: Optional[str] = Field(default="Maharashtra", max_length=255)
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=1)

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(...)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

