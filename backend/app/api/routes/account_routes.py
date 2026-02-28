from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.services.account_service import get_account_by_user_id
from app.core.rbac import get_current_user, require_role

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/my-account")
def get_my_account(
    user=Depends(require_role("customer")),
    db: Session = Depends(get_db)
):
    account = get_account_by_user_id(db, user.id)

    return {
        "account_number": account.account_number,
        "account_type": account.account_type,
        "balance": float(account.balance)
    }