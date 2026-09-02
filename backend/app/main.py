from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from contextlib import asynccontextmanager
from app.config import settings
from app.database import init_db

# Import modular routers
from app.routes import (
    auth_router,
    animals_router,
    vaccinations_router,
    health_reports_router,
    risk_assessments_router,
    clusters_router,
    alerts_router,
    vet_router,
    authority_router,
    laboratory_router,
    field_worker_router,
    admin_router,
    analytics_router,
    notifications_router,
    timeline_router,
    ai_assistant_router,
    weather_router,
    treatment_router,
    nutrition_router,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
# PASHURAKSHA AI — Livestock Health Intelligence & Outbreak Early-Warning Platform
**Smart India Hackathon 2026 • Problem Statement ID: SIH26128**

### Core Intelligence Pipeline
1. **Farmer Ingestion**: Digital livestock profiles, vaccination records, and structured symptom reporting.
2. **AI Decision Support**: Explainable risk scoring (0–100) and transparent factor breakdown.
3. **Outbreak Intelligence**: Spatial-temporal cluster detection and early warning alerts.
4. **Clinical & Governance**: Prioritized veterinary case dispatch and district-level surveillance.

> **Non-Diagnostic Principle**: PASHURAKSHA AI provides decision-support and surveillance intelligence. It does not replace professional veterinary diagnosis or treatment.
    """,
    version="0.5.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    openapi_tags=[
        {"name": "Core & Health", "description": "System health and runtime status"},
        {"name": "Authentication", "description": "User registration, login, and profile access"},
        {"name": "Animals & Digital Records", "description": "Livestock profiling and animal records management"},
        {"name": "Vaccinations", "description": "Vaccine logging, schedules, and immunity tracking"},
        {"name": "Health Reports & Symptom Ingestion", "description": "Symptom reporting and epidemiology intake"},
        {"name": "AI Risk Assessment & Explainability", "description": "Explainable risk scores, factors, and recommendations"},
        {"name": "Outbreak Clusters & Early Warning", "description": "Spatial-temporal disease cluster detection and centroid queries"},
        {"name": "Alerts & Notifications", "description": "Multi-tier alerts for farmers, vets, and authorities"},
        {"name": "Veterinarian Clinical Desk", "description": "Clinical triage queue, case investigation, and lab referral"},
        {"name": "Authority Surveillance & Hotspots", "description": "District KPI summaries, village risk stratification, and GIS coordinates"},
        {"name": "Laboratory & Diagnostics", "description": "Lab referral management, sample tracking, and result entry"},
        {"name": "Field Worker", "description": "Farm visits, assigned cases, and on-behalf reporting"},
        {"name": "Administration", "description": "User management, system statistics, and configuration"},
        {"name": "Analytics & Intelligence", "description": "Aggregated insights, trends, and performance metrics"},
        {"name": "Notifications", "description": "User notification management"},
        {"name": "Case Timeline", "description": "Case lifecycle event tracking"},
        {"name": "AI Assistant", "description": "Context-aware AI decision support"},
        {"name": "Weather & Environment", "description": "Environmental risk factors and weather data"},
    ]
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.all_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers under API_V1_STR (/api/v1)
api_v1 = settings.API_V1_STR
app.include_router(auth_router, prefix=api_v1)
app.include_router(animals_router, prefix=api_v1)
app.include_router(vaccinations_router, prefix=api_v1)
app.include_router(health_reports_router, prefix=api_v1)
app.include_router(risk_assessments_router, prefix=api_v1)
app.include_router(clusters_router, prefix=api_v1)
app.include_router(alerts_router, prefix=api_v1)
app.include_router(vet_router, prefix=api_v1)
app.include_router(authority_router, prefix=api_v1)
app.include_router(laboratory_router, prefix=api_v1)
app.include_router(field_worker_router, prefix=api_v1)
app.include_router(admin_router, prefix=api_v1)
app.include_router(analytics_router, prefix=api_v1)
app.include_router(notifications_router, prefix=api_v1)
app.include_router(timeline_router, prefix=api_v1)
app.include_router(ai_assistant_router, prefix=api_v1)
app.include_router(weather_router, prefix=api_v1)
app.include_router(treatment_router, prefix=api_v1)
app.include_router(nutrition_router, prefix=api_v1)

@app.get("/", tags=["Core & Health"])
def read_root():
    return {
        "service": settings.PROJECT_NAME,
        "tagline": "Livestock Health Intelligence & Outbreak Early-Warning Platform",
        "ps_id": "SIH26128",
        "theme": "Agriculture, FoodTech & Rural Development",
        "status": "online",
        "version": "0.5.0",
        "docs": "/docs",
        "health_check": f"{settings.API_V1_STR}/health",
        "endpoints": {
            "auth": f"{api_v1}/auth",
            "animals": f"{api_v1}/animals",
            "vaccinations": f"{api_v1}/vaccinations",
            "health_reports": f"{api_v1}/health-reports",
            "clusters": f"{api_v1}/clusters",
            "alerts": f"{api_v1}/alerts",
            "vet": f"{api_v1}/vet/cases",
            "authority": f"{api_v1}/authority/dashboard",
            "laboratory": f"{api_v1}/lab/dashboard",
            "field_worker": f"{api_v1}/field-worker/dashboard",
            "admin": f"{api_v1}/admin/stats",
            "analytics": f"{api_v1}/analytics/overview",
            "notifications": f"{api_v1}/notifications",
            "ai_assistant": f"{api_v1}/ai/ask",
            "weather": f"{api_v1}/weather",
        }
    }

@app.get(f"{settings.API_V1_STR}/health", tags=["Core & Health"])
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": settings.PROJECT_NAME,
        "version": "0.5.0",
        "environment": settings.ENVIRONMENT,
        "database": "SQLAlchemy ORM (Active)",
        "total_endpoints": 17,
        "disclaimer": "PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. It does not replace professional veterinary diagnosis or treatment."
    }
