from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.services.admin_analytics_service import get_portfolio_overview
from app.core.rbac import require_role

router = APIRouter(prefix="/admin", tags=["Admin"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/portfolio")
def portfolio_analytics(
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))  # lowercase as per your DB
):
    return get_portfolio_overview(db)