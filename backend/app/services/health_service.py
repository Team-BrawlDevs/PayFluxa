from sqlalchemy.orm import Session
from app.db.models import Account, Transaction
from decimal import Decimal, ROUND_HALF_UP
from fastapi import HTTPException
from sqlalchemy import func
from datetime import datetime, timedelta


def calculate_health_score(db: Session, user_id: int):

    # ---- 1. Fetch User Accounts Safely ----
    accounts = db.query(Account).filter(Account.user_id == user_id).all()

    if not accounts:
        raise HTTPException(status_code=404, detail="No accounts found")

    account_ids = [acc.id for acc in accounts]

    total_balance = sum([Decimal(acc.balance) for acc in accounts])

    # ---- 2. Fetch Last 6 Months User-Specific Transactions ----
    six_months_ago = datetime.utcnow() - timedelta(days=180)

    transactions = db.query(Transaction).filter(
        Transaction.created_at >= six_months_ago,
        Transaction.status == "SUCCESS",
        (
            (Transaction.from_account_id.in_(account_ids)) |
            (Transaction.to_account_id.in_(account_ids))
        )
    ).all()

    if not transactions:
        return {
            "health_score": 50,
            "components": {
                "savings_score": 10,
                "expense_score": 10,
                "behavior_score": 10,
                "liquidity_score": 10,
                "debt_score": 10
            }
        }

    # ---- 3. Aggregate Income & Expenses ----
    total_income = Decimal(0)
    total_expense = Decimal(0)
    failed_count = db.query(func.count(Transaction.id)).filter(
        Transaction.status == "FAILED",
        Transaction.created_at >= six_months_ago,
        (
            (Transaction.from_account_id.in_(account_ids)) |
            (Transaction.to_account_id.in_(account_ids))
        )
    ).scalar() or 0

    monthly_expense_map = {}

    for txn in transactions:

        txn_amount = Decimal(txn.amount)

        if txn.transaction_type == "DEPOSIT":
            total_income += txn_amount

        if txn.transaction_type in ["WITHDRAW", "TRANSFER"]:
            total_expense += txn_amount

            month_key = txn.created_at.strftime("%Y-%m")
            monthly_expense_map.setdefault(month_key, Decimal(0))
            monthly_expense_map[month_key] += txn_amount

    # ---- 4. Defensive Normalizations ----
    avg_monthly_income = total_income / Decimal(6) if total_income > 0 else Decimal(0)
    avg_monthly_expense = total_expense / Decimal(6) if total_expense > 0 else Decimal(0)

    # ---- 5. Component 1: Savings Ratio (Max 25) ----
    if total_income > 0:
        savings_ratio = (total_balance / total_income)
        savings_score = min(float((savings_ratio * Decimal(25)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)), 25)
    else:
        savings_score = 5  # Penalize no income history

    # ---- 6. Component 2: Expense Stability (Max 20) ----
    if len(monthly_expense_map) > 1:
        expenses = list(monthly_expense_map.values())
        mean_expense = sum(expenses) / len(expenses)
        variance = sum([(x - mean_expense) ** 2 for x in expenses]) / len(expenses)
        volatility_ratio = (variance.sqrt() / mean_expense) if mean_expense > 0 else Decimal(0)

        if volatility_ratio < Decimal("0.25"):
            expense_score = 20
        elif volatility_ratio < Decimal("0.50"):
            expense_score = 15
        else:
            expense_score = 8
    else:
        expense_score = 10

    # ---- 7. Component 3: Transaction Behavior (Max 20) ----
    behavior_score = max(20 - (failed_count * 2), 0)

    # ---- 8. Component 4: Liquidity Buffer (Max 20) ----
    if avg_monthly_expense > 0:
        liquidity_months = total_balance / avg_monthly_expense
        liquidity_score = min(float((liquidity_months * Decimal(5)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)), 20)
    else:
        liquidity_score = 15

    # ---- 9. Component 5: Debt Placeholder (Max 15) ----
    debt_score = 15  # Until loan engine integrates

    # ---- 10. Final Score Normalized ----
    final_score = (
        Decimal(savings_score) +
        Decimal(expense_score) +
        Decimal(behavior_score) +
        Decimal(liquidity_score) +
        Decimal(debt_score)
    )

    final_score = min(final_score, Decimal(100))

    return {
        "health_score": float(final_score.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)),
        "components": {
            "savings_score": savings_score,
            "expense_score": expense_score,
            "behavior_score": behavior_score,
            "liquidity_score": liquidity_score,
            "debt_score": debt_score
        }
    }