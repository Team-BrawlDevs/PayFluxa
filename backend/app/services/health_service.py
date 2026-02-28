from sqlalchemy.orm import Session
from app.db.models import Account, Transaction
from decimal import Decimal
from fastapi import HTTPException
from sqlalchemy import func
from datetime import datetime, timedelta


def calculate_health_score(db: Session, user_id: int):

    # Get user's accounts
    accounts = db.query(Account).filter(Account.user_id == user_id).all()

    if not accounts:
        raise HTTPException(status_code=404, detail="No accounts found")

    total_balance = sum([acc.balance for acc in accounts])

    # Last 6 months transactions
    six_months_ago = datetime.utcnow() - timedelta(days=180)

    transactions = db.query(Transaction).filter(
        Transaction.created_at >= six_months_ago
    ).all()

    if not transactions:
        return {"health_score": 50, "message": "Insufficient transaction history"}

    total_income = Decimal(0)
    total_expense = Decimal(0)
    failed_count = 0

    for txn in transactions:
        if txn.status == "FAILED":
            failed_count += 1

        if txn.transaction_type in ["DEPOSIT"]:
            total_income += txn.amount

        if txn.transaction_type in ["WITHDRAW", "TRANSFER"]:
            total_expense += txn.amount

    avg_monthly_expense = total_expense / Decimal(6)

    # ---- Component Scores ----

    # 1. Savings Ratio
    savings_ratio = (total_balance / total_income) if total_income > 0 else Decimal(0)
    savings_score = min(float(savings_ratio * 25), 25)

    # 2. Expense Stability (lower expense = better)
    expense_score = 20 if avg_monthly_expense < total_income / 6 else 10

    # 3. Transaction Behaviour
    behavior_score = max(20 - failed_count * 2, 0)

    # 4. Liquidity Buffer (months survival)
    liquidity_months = (total_balance / avg_monthly_expense) if avg_monthly_expense > 0 else 0
    liquidity_score = min(float(liquidity_months * 5), 20)

    # 5. Debt Load (placeholder for Phase 2 loan logic)
    debt_score = 15

    final_score = round(
        savings_score +
        expense_score +
        behavior_score +
        liquidity_score +
        debt_score,
        2
    )

    return {
        "health_score": min(final_score, 100),
        "components": {
            "savings_score": savings_score,
            "expense_score": expense_score,
            "behavior_score": behavior_score,
            "liquidity_score": liquidity_score,
            "debt_score": debt_score
        }
    }