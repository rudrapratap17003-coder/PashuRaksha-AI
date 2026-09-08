import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("pashuraksha.database")

# Determine Database URL
# Format for PostgreSQL: postgresql://user:password@host:port/dbname
# Default fallback: sqlite:///./pashuraksha.db for zero-config local execution
DATABASE_URL = os.getenv("DATABASE_URL") or settings.DATABASE_URL

if DATABASE_URL:
    # SQLAlchemy 2.0 compatibility: fix legacy postgres:// prefix from Heroku/Render/Neon
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    # Local development / temporary fallback
    if os.getenv("VERCEL"):
        import tempfile
        tmp_db = os.path.join(tempfile.gettempdir(), "pashuraksha.db").replace("\\", "/")
        DATABASE_URL = f"sqlite:///{tmp_db}"
    else:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        db_path = os.path.join(base_dir, "pashuraksha.db").replace("\\", "/")
        DATABASE_URL = f"sqlite:///{db_path}"

    if (settings.ENVIRONMENT.lower() == "production" or not settings.DEMO_MODE) and not os.getenv("DEMO_MODE", "").strip().lower() in ("true", "1", "yes") and not os.getenv("VERCEL"):
        raise RuntimeError(
            "FATAL DATABASE CONFIGURATION ERROR: When running in production mode (DEMO_MODE=false), "
            "a persistent PostgreSQL DATABASE_URL must be provided. "
            "SQLite cannot be used as production persistence. "
            "Example: DATABASE_URL=postgresql://user:password@host:5432/dbname"
        )
    else:
        logger.warning(
            "[DATABASE NOTICE] Using local/temporary SQLite database (DEMO_MODE=true or Vercel preview). "
            "Set DATABASE_URL with a PostgreSQL instance for production deployment."
        )

engine_kwargs = {"echo": False}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # Production PostgreSQL connection pooling configuration
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300

engine = create_engine(
    DATABASE_URL,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    FastAPI dependency that provides a transactional database session per request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Initializes database tables and seeds demo data if empty.
    """
    import app.models  # Ensure all models are registered
    Base.metadata.create_all(bind=engine)
    
    # Run seeder
    from app.services.seed_service import seed_database
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
