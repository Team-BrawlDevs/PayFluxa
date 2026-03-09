from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.db.database import SessionLocal
from app.core.rbac import get_current_user
from app.services.copilot_service import generate_financial_advice

router = APIRouter(prefix="/copilot", tags=["Copilot"])

class ChatHistory(BaseModel):
    user: str
    assistant: str

class CopilotRequest(BaseModel):
    question: str
    history: Optional[List[ChatHistory]] = []

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/chat")
def copilot_chat(
    request: CopilotRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    history_dicts = [{"user": h.user, "assistant": h.assistant} for h in request.history]
    
    return generate_financial_advice(
        db=db,
        user_id=user.id,
        question=request.question,
        chat_history=history_dicts
    )