from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import timedelta

from ..db import get_db
from ..models.auth import UserRegister, UserResponse, Token
from ..services.auth_service import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister, db: AsyncIOMotorDatabase = Depends(get_db)):
    # Check if user already exists
    existing_user = await db["users"].find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An operator profile with this email is already registered."
        )

    # Hash the password
    hashed_password = get_password_hash(user_in.password)

    # Prepare user doc
    user_doc = {
        "first_name": user_in.first_name,
        "last_name": user_in.last_name,
        "email": user_in.email,
        "hashed_password": hashed_password
    }

    # Save to MongoDB
    result = await db["users"].insert_one(user_doc)
    
    # Return user response
    return UserResponse(
        id=str(result.inserted_id),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email
    )

@router.post("/token", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Verify username (which is the email)
    user = await db["users"].find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(data={"sub": user["email"]})
    return Token(access_token=access_token, token_type="bearer")
