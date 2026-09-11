import os
import sys
from pathlib import Path

# Add backend directory to sys.path so app modules are discoverable
root_dir = Path(__file__).resolve().parent.parent
backend_dir = root_dir / "backend"

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

# Mark environment as Vercel serverless
os.environ["VERCEL"] = "1"
os.environ.setdefault("DEMO_MODE", "true")
os.environ.setdefault("ENVIRONMENT", "production")

from app.main import app
