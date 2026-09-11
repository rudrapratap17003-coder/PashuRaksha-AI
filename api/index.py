"""
Vercel Serverless Function entry point for the PashuRaksha AI FastAPI backend.

This file exposes the FastAPI application instance to Vercel's Python runtime,
enabling the entire backend to run as serverless functions on the same Vercel
deployment as the frontend.
"""
import sys
import os

# Set VERCEL environment flag if not already set (enables SQLite fallback & demo mode)
os.environ.setdefault("VERCEL", "1")
os.environ.setdefault("DEMO_MODE", "true")

# Ensure the backend directory is on the Python path so that 'app.*' imports work.
# On Vercel, the project root is the parent of the 'api/' directory.
api_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(api_dir)
backend_dir = os.path.join(project_root, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app
