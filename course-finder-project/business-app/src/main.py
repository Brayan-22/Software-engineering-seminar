from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables from .env file
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

# Import settings after loading .env
from src.core.config import settings
from src.api.routes import api_router

# Create FastAPI src
src = FastAPI(
    title=settings.src_NAME,
    version=settings.src_VERSION,
    debug=settings.DEBUG,
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
    openapi_url=f"{settings.API_PREFIX}/openapi.json"
)

# Configure CORS
src.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router with all endpoints
src.include_router(api_router, prefix=settings.API_PREFIX)


# Health check endpoint
@src.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "src": settings.src_NAME,
        "version": settings.src_VERSION
    }


# Root endpoint
@src.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.src_NAME}",
        "docs": f"{settings.API_PREFIX}/docs"
    }
