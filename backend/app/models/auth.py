from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegister(BaseModel):
    first_name: str = Field(..., min_length=1, description="First name of the user")
    last_name: str = Field(..., min_length=1, description="Last name of the user")
    email: EmailStr = Field(..., description="Enterprise email of the user")
    password: str = Field(..., min_length=6, description="Password (at least 6 characters)")

class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr

    class Config:
        populate_by_name = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
