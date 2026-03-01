from sqlalchemy.orm import Session
from app.db.models import Account, Transaction, Loan
from datetime import datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP
import math
from collections import defaultdict


def get_monthly_income_summary(db: Session, user_id: int):

    six_months_ago = datetime.utcnow() - timedelta(days=180)

    # ---- Fetch Accounts ----
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    account_ids = [acc.id for acc in accounts]
    total_balance = sum([Decimal(acc.balance) for acc in accounts])

    # ---- Fetch Transactions ----
    transactions = db.query(Transaction).filter(
        Transaction.created_at >= six_months_ago,
        Transaction.status == "SUCCESS",
        (
            (Transaction.from_account_id.in_(account_ids)) |
            (Transaction.to_account_id.in_(account_ids))
        )
    ).all()

    monthly_income_map = defaultdict(Decimal)
    monthly_expense_map = defaultdict(Decimal)

    for txn in transactions:

        amount = Decimal(txn.amount)
        month_key = txn.created_at.strftime("%Y-%m")

        if txn.transaction_type == "DEPOSIT":
            monthly_income_map[month_key] += amount

        if txn.transaction_type in ["WITHDRAW", "TRANSFER"]:
            monthly_expense_map[month_key] += amount

    # ---- Average Monthly Income ----
    incomes = list(monthly_income_map.values())
    total_income = sum(incomes)
    avg_monthly_income = (
        total_income / Decimal(6)
        if total_income > 0 else Decimal(0)
    )

    # ---- Income Volatility ----
    if incomes and avg_monthly_income > 0:
        mean = avg_monthly_income
        variance = sum([(x - mean) ** 2 for x in incomes]) / len(incomes)
        std_dev = variance.sqrt()
        volatility = (std_dev / mean) * Decimal(100)
    else:
        volatility = Decimal(0)

    # ---- Loan EMI ----
    active_loans = db.query(Loan).filter(
        Loan.user_id == user_id,
        Loan.status == "ACTIVE"
    ).all()

    total_emi = sum([Decimal(loan.emi_amount) for loan in active_loans])

    # ---- EMI Burden ----
    if avg_monthly_income > 0:
        emi_burden_ratio = (total_emi / avg_monthly_income) * Decimal(100)
    else:
        emi_burden_ratio = Decimal(0)

    # ---- Buffer Strength ----
    avg_monthly_expense = (
        sum(monthly_expense_map.values()) / Decimal(6)
        if monthly_expense_map else Decimal(0)
    )

    monthly_outflow = avg_monthly_expense + total_emi

    if monthly_outflow > 0:
        buffer_months = total_balance / monthly_outflow
    else:
        buffer_months = Decimal(0)

    return {
        "average_monthly_income": float(
            avg_monthly_income.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        ),
        "income_volatility_percent": float(
            volatility.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
        ),
        "emi_burden_ratio_percent": float(
            emi_burden_ratio.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
        ),
        "buffer_strength_months": float(
            buffer_months.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        )
    }