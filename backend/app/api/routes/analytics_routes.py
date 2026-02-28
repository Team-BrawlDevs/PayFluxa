from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.core.rbac import get_current_user
from app.services.health_service import calculate_health_score
from app.services.risk_service import calculate_risk_profile

router = APIRouter(prefix="/analytics", tags=["Analytics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/health-score")
def get_health_score(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return calculate_health_score(db, user.id)

@router.get("/risk-profile")
def get_risk_profile(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return calculate_risk_profile(db, user.id)