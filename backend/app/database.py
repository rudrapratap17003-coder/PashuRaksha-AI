import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Determine Database URL
# Format for PostgreSQL: postgresql://user:password@host:port/dbname
# Default fallback: sqlite:///./pashuraksha.db for zero-config local execution
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pashuraksha.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
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
