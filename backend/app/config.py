from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "ChurnRadar AI Retention Engine"
    MONGO_URI: str = Field("mongodb://localhost:27017", env="MONGO_URI")
    DATABASE_NAME: str = "churnradar_db"
    JWT_SECRET: str = Field("super_secret_cryptographic_key_for_churnradar_ai_2026", env="JWT_SECRET")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
