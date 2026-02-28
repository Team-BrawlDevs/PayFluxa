from sqlalchemy.orm import Session
from app.db.models import Account, Transaction, LedgerEntry
from app.services.audit_service import create_audit_log
from fastapi import HTTPException
from datetime import datetime
from decimal import Decimal
import uuid


# 🔍 Get account using account_number
def get_account(db: Session, account_number: str):
    account = db.query(Account).filter(
        Account.account_number == str(account_number)
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    return account


# 💰 DEPOSIT
def deposit(db: Session, account_number: str, amount: float, user_id: int):
    try:
        amount = Decimal(amount)
        account = get_account(db, account_number)

        account.balance += amount

        txn = Transaction(
            from_account_id=None,
            to_account_id=account.id,
            amount=amount,
            transaction_type="DEPOSIT",
            status="SUCCESS",
            reference_code=str(uuid.uuid4()),
            created_at=datetime.utcnow()
        )

        db.add(txn)
        db.flush()

        db.add(
            LedgerEntry(
                account_id=account.id,
                transaction_id=txn.id,  
                entry_type="CREDIT",
                amount=amount,
                created_at=datetime.utcnow()
            )
        )

        create_audit_log(
            db, user_id, "DEPOSIT",
            f"Deposited {amount} to account {account.account_number}"
        )

        db.commit()
        return txn

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# 💸 WITHDRAW
def withdraw(db: Session, account_number: str, amount: float, user_id: int):
    try:
        amount = Decimal(amount)
        account = get_account(db, account_number)

        if account.balance < amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")

        account.balance -= amount

        txn = Transaction(
            from_account_id=account.id,
            to_account_id=None,
            amount=amount,
            transaction_type="WITHDRAW",
            status="SUCCESS",
            reference_code=str(uuid.uuid4()),
            created_at=datetime.utcnow()
        )

        db.add(txn)
        db.flush()

        db.add(
            LedgerEntry(
                account_id=account.id,
                transaction_id=txn.id,
                entry_type="DEBIT",
                amount=amount,
                created_at=datetime.utcnow()
            )
        )

        create_audit_log(
            db, user_id, "WITHDRAW",
            f"Withdraw {amount} from account {account.account_number}"
        )

        db.commit()
        return txn

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# 🔁 TRANSFER
def transfer(db: Session, from_acc_num: str, to_acc_num: str, amount: float, user_id: int):
    try:
        amount = Decimal(amount)

        from_acc = get_account(db, from_acc_num)
        to_acc = get_account(db, to_acc_num)

        if from_acc.balance < amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")

        from_acc.balance -= amount
        to_acc.balance += amount

        txn = Transaction(
            from_account_id=from_acc.id,
            to_account_id=to_acc.id,
            amount=amount,
            transaction_type="TRANSFER",
            status="SUCCESS",
            reference_code=str(uuid.uuid4()),
            created_at=datetime.utcnow()
        )

        db.add(txn)
        db.flush()

        db.add_all([
            LedgerEntry(
                account_id=from_acc.id,
                transaction_id=txn.id,
                entry_type="DEBIT",
                amount=amount,
                created_at=datetime.utcnow()
            ),
            LedgerEntry(
                account_id=to_acc.id,
                transaction_id=txn.id,
                entry_type="CREDIT",
                amount=amount,
                created_at=datetime.utcnow()
            )
        ])

        create_audit_log(
            db, user_id, "TRANSFER",
            f"{amount} from {from_acc.account_number} → {to_acc.account_number}"
        )

        db.commit()
        return txn

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
def get_my_transactions(db: Session, user_id: int):

    return (
        db.query(Transaction)
        .join(Account, Account.id == Transaction.from_account_id)
        .filter(Account.user_id == user_id)
        .order_by(Transaction.created_at.desc())
        .all()
    )   

def get_account_statement(db: Session, account_number: str):

    account = get_account(db, account_number)

    entries = (
        db.query(LedgerEntry)
        .filter(LedgerEntry.account_id == account.id)
        .order_by(LedgerEntry.created_at.desc())
        .all()
    )

    return entries

def get_all_transactions(db: Session, limit: int, offset: int):

    return (
        db.query(Transaction)
        .order_by(Transaction.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )