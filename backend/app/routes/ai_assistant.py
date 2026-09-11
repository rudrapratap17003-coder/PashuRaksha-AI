from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.services.ai_assistant_service import AIAssistantService

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

class AIQuery(BaseModel):
    query: str
    role: str = "farmer"
    language: str = "en"
    context: dict = None

@router.post("/ask")
def ask_ai(
    data: AIQuery,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Context-aware veterinary assistant query.
    Authenticated users only.
    """
    effective_role = current_user.role or data.role
    return AIAssistantService.process_query(db, data.query, effective_role, data.language, data.context)
