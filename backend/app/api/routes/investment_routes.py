from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.services.investment_service import get_investment_advisory
from app.core.rbac import get_current_user

router = APIRouter(prefix="/investment", tags=["Investment"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/advisor")
def investment_advisor(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    return get_investment_advisory(db, user.id)