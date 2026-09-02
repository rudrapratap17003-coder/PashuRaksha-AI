from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.ai_assistant_service import AIAssistantService

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

class AIQuery(BaseModel):
    query: str
    role: str = "farmer"
    context: dict = None

@router.post("/ask")
def ask_ai(data: AIQuery, db: Session = Depends(get_db)):
    return AIAssistantService.process_query(db, data.query, data.role, data.context)
