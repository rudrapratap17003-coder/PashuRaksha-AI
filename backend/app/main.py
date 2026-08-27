from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Livestock Health Intelligence & Outbreak Early-Warning Platform (SIH26128)",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "service": settings.PROJECT_NAME,
        "tagline": "Livestock Health Intelligence & Outbreak Early-Warning Platform",
        "ps_id": "SIH26128",
        "theme": "Agriculture, FoodTech & Rural Development",
        "status": "online",
        "docs": "/docs",
        "health_check": f"{settings.API_V1_STR}/health"
    }

@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": settings.PROJECT_NAME,
        "version": "0.1.0",
        "environment": settings.ENVIRONMENT,
        "disclaimer": "PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. It does not replace professional veterinary diagnosis or treatment."
    }
