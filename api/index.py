"""
Vercel Serverless Function — FastAPI wrapper for PashuRaksha AI backend.
Routes all /api/* requests to the existing FastAPI application.
"""
import sys
import os

# Add the backend directory to Python path so 'app' package is importable
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Configure environment for Vercel serverless
os.environ.setdefault('ENVIRONMENT', 'production')

# Use /tmp for SQLite since Vercel's filesystem is read-only except /tmp
if 'DATABASE_URL' not in os.environ:
    os.environ['DATABASE_URL'] = 'sqlite:////tmp/pashuraksha.db'

# Initialize the database and seed demo data on cold start
from app.database import init_db
init_db()

# Import the FastAPI app — this is what Vercel's Python runtime serves
from app.main import app
