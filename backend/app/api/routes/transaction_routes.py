from fastapi import APIRouter, Depends
from app.db.models import Transaction
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.services.transaction_service import deposit, get_account_statement, get_all_transactions, get_my_transactions, withdraw, transfer
from app.core.rbac import get_current_user, require_role

router = APIRouter(prefix="/transaction", tags=["Transaction"])


# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 💰 DEPOSIT
@router.post("/deposit")
def deposit_money(account_id: int, amount: float,
                  user=Depends(get_current_user),
                  db: Session = Depends(get_db)):

    txn = deposit(db, account_id, amount, user.id)
    return {"message": "Deposit successful", "transaction_id": txn.id}


# 💸 WITHDRAW
@router.post("/withdraw")
def withdraw_money(account_id: int, amount: float,
                   user=Depends(get_current_user),
                   db: Session = Depends(get_db)):

    txn = withdraw(db, account_id, amount, user.id)
    return {"message": "Withdraw successful", "transaction_id": txn.id}


# 🔁 TRANSFER
@router.post("/transfer")
def transfer_money(from_account: int, to_account: int, amount: float,
                   user=Depends(get_current_user),
                   db: Session = Depends(get_db)):

    txn = transfer(db, from_account, to_account, amount, user.id)
    return {"message": "Transfer successful", "transaction_id": txn.id}
@router.get("/my-transactions")
def my_transactions(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return get_my_transactions(db, user.id)

@router.get("/statement")
def account_statement(
    account_number: str,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return get_account_statement(db, account_number)

@router.get("/admin/transactions")
def all_transactions(
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin"))
):
    return get_all_transactions(db, limit, offset)
