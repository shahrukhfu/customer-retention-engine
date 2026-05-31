from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging

from .config import settings
from .db import connect_to_mongo, close_mongo_connection
from .routes import auth, predict, metrics
from .services.ml_service import ml_service

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Starting up FastAPI application...")
    
    # 1. Connect to MongoDB
    await connect_to_mongo()
    
    # 2. Load ML model & transformers
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, 'assets', 'model.pkl')
    preprocessor_path = os.path.join(current_dir, 'assets', 'preprocessor.pkl')
    
    try:
        ml_service.load_artifacts(model_path, preprocessor_path)
    except FileNotFoundError:
        logger.warning("WARNING: ML model or preprocessor pickles not found on disk at startup.")
        logger.warning("Inference routes will fail until backend/pipeline/train.py is executed.")
    
    yield
    
    # Shutdown actions
    logger.info("Shutting down FastAPI application...")
    await close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise-grade customer churn prediction and risk profiling REST API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS Middleware (Crucial for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(metrics.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "model_loaded": ml_service.model is not None
    }
