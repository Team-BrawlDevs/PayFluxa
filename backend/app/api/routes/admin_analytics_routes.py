from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.services.portfolio_service import build_portfolio_dashboard
from app.core.rbac import require_role

router = APIRouter(
    prefix="/admin/analytics",
    tags=["Admin Analytics"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/portfolio")
def portfolio_dashboard(
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))
):
    return build_portfolio_dashboard(db)