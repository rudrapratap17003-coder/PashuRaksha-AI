import uuid
import logging
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.config import settings
from app.database import init_db, SessionLocal
from app.utils import get_logger, get_utc_now

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
    demo_router,
)

logger = get_logger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"[APPLICATION_START] Initializing {settings.PROJECT_NAME} (Environment: {settings.ENVIRONMENT}, Demo Mode: {settings.DEMO_MODE})")
    init_db()
    logger.info(f"[APPLICATION_START] Database initialized and routes loaded.")
    yield
    logger.info(f"[APPLICATION_STOP] Shutting down {settings.PROJECT_NAME} cleanly.")

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
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Centralized Global Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        loc = " -> ".join([str(l) for l in err.get("loc", [])])
        errors.append({"field": loc, "message": err.get("msg", "Validation error")})
    logger.warning(f"[API_VALIDATION_ERROR] Path: {request.url.path} | Errors: {errors}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Request validation failed", "errors": errors, "code": "VALIDATION_ERROR"}
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.info(f"[HTTP_EXCEPTION] Path: {request.url.path} | Status: {exc.status_code} | Detail: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    trace_id = str(uuid.uuid4())[:8]
    logger.error(f"[DATABASE_INTEGRITY_ERROR] Trace: {trace_id} | Path: {request.url.path} | Error: {str(exc.orig) if hasattr(exc, 'orig') else str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={
            "detail": "Data conflict or unique constraint violation. Please verify input identifiers.",
            "code": "DB_INTEGRITY_CONFLICT",
            "trace_id": trace_id
        }
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    trace_id = str(uuid.uuid4())[:8]
    logger.error(f"[DATABASE_ERROR] Trace: {trace_id} | Path: {request.url.path} | Error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "A database operation error occurred. Transaction was rolled back safely.",
            "code": "DATABASE_ERROR",
            "trace_id": trace_id
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    trace_id = str(uuid.uuid4())[:8]
    logger.exception(f"[UNHANDLED_EXCEPTION] Trace: {trace_id} | Path: {request.url.path} | Error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred. Please contact system administrator.",
            "code": "INTERNAL_SERVER_ERROR",
            "trace_id": trace_id
        }
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
app.include_router(demo_router, prefix=api_v1)

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

@app.get("/health", tags=["Core & Health"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Core & Health"])
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": settings.PROJECT_NAME,
        "version": "0.5.0",
        "environment": settings.ENVIRONMENT,
        "database": "SQLAlchemy ORM (Active)",
        "total_endpoints": 17,
        "disclaimer": "PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. It does not replace professional veterinary diagnosis or treatment."
    }

