from sqlalchemy.orm import Session
from app.db.models import Account, Transaction, Loan
from datetime import datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP
from collections import defaultdict
from dateutil.relativedelta import relativedelta


def get_monthly_income_summary(db: Session, user_id: int):

    six_months_ago = datetime.utcnow() - timedelta(days=180)

    # ---- Fetch Accounts ----
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    account_ids = [acc.id for acc in accounts]

    total_balance = sum([Decimal(acc.balance) for acc in accounts])

    # ---- Fetch Transactions (6 months) ----
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

        if txn.transaction_type == "WITHDRAW":
            monthly_expense_map[month_key] += amount

    # ---- Build 6 Month Trend Properly ----
    monthly_trend = []
    current = datetime.utcnow().replace(day=1)

    for i in range(5, -1, -1):
        month_date = current - relativedelta(months=i)
        month_key = month_date.strftime("%Y-%m")
        month_label = month_date.strftime("%b")

        income = monthly_income_map.get(month_key, Decimal(0))
        expense = monthly_expense_map.get(month_key, Decimal(0))
        surplus = income - expense

        monthly_trend.append({
            "month": month_label,
            "income": float(income),
            "expense": float(expense),
            "surplus": float(surplus)
        })

    # ---- Summary Calculations ----
    incomes = [Decimal(m["income"]) for m in monthly_trend]
    total_income = sum(incomes)

    avg_monthly_income = total_income / Decimal(6) if total_income > 0 else Decimal(0)

    if incomes and avg_monthly_income > 0:
        mean = avg_monthly_income
        variance = sum([(x - mean) ** 2 for x in incomes]) / len(incomes)
        std_dev = variance.sqrt()
        volatility = (std_dev / mean) * Decimal(100)
    else:
        volatility = Decimal(0)

    active_loans = db.query(Loan).filter(
        Loan.user_id == user_id,
        Loan.status == "ACTIVE"
    ).all()

    total_emi = sum([Decimal(loan.emi_amount) for loan in active_loans])

    emi_burden_ratio = (
        (total_emi / avg_monthly_income) * Decimal(100)
        if avg_monthly_income > 0 else Decimal(0)
    )

    avg_monthly_expense = sum(
        [Decimal(m["expense"]) for m in monthly_trend]
    ) / Decimal(6)

    monthly_outflow = avg_monthly_expense + total_emi

    buffer_months = (
        total_balance / monthly_outflow
        if monthly_outflow > 0 else Decimal(0)
    )

    # ---- Latest Transactions (Last 10) ----
    latest_transactions = db.query(Transaction).filter(
        Transaction.status == "SUCCESS",
        (
            (Transaction.from_account_id.in_(account_ids)) |
            (Transaction.to_account_id.in_(account_ids))
        )
    ).order_by(Transaction.created_at.desc()).limit(10).all()

    formatted_transactions = []

    for txn in latest_transactions:

        if txn.transaction_type == "DEPOSIT":
            txn_type = "Credit"
            amount = float(txn.amount)

        elif txn.transaction_type == "WITHDRAW":
            txn_type = "Debit"
            amount = -float(txn.amount)

        else:
            continue  # ignore transfers

        formatted_transactions.append({
            "date": txn.created_at.strftime("%d %b %Y"),
            "type": txn_type,
            "category": txn.transaction_type,
            "amount": amount,
            "balance": float(total_balance)  # or compute running balance if needed
        })

    return {
        "summary": {
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
        },
        "monthly_trend": monthly_trend,
        "transactions": formatted_transactions
    }