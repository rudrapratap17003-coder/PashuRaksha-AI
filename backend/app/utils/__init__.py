import logging
import sys
from datetime import datetime, timezone

def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)

def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(f'pashuraksha.{name}')
    return logger
