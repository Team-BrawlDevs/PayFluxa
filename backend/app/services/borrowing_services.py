from sqlalchemy.orm import Session
from sqlalchemy import or_
from decimal import Decimal
from datetime import datetime, timedelta

from app.db.models import Account, Loan, Transaction
from app.services.monte_carlo_service import monte_carlo_forecast


def get_borrowing_readiness(db: Session, user_id: int):

    # =============================
    # 1️⃣ Fetch Accounts
    # =============================

    accounts = db.query(Account).filter(Account.user_id == user_id).all()

    if not accounts:
        return {"message": "No accounts found"}

    account_ids = [a.id for a in accounts]

    total_balance = sum([Decimal(a.balance or 0) for a in accounts])

    # =============================
    # 2️⃣ Last 6 Months Transactions
    # =============================

    six_months_ago = datetime.utcnow() - timedelta(days=180)

    txns = db.query(Transaction).filter(
        Transaction.created_at >= six_months_ago,
        Transaction.status == "SUCCESS",
        or_(
            Transaction.from_account_id.in_(account_ids),
            Transaction.to_account_id.in_(account_ids)
        )
    ).all()

    income = Decimal(0)
    expenses = Decimal(0)

    for txn in txns:

        amount = Decimal(txn.amount)

        if txn.transaction_type == "DEPOSIT":
            income += amount

        elif txn.transaction_type == "WITHDRAW":
            expenses += amount

    monthly_income = income / Decimal(6) if income else Decimal(0)
    monthly_expense = expenses / Decimal(6) if expenses else Decimal(0)

    # =============================
    # 3️⃣ Existing EMI
    # =============================

    loans = db.query(Loan).filter(
        Loan.user_id == user_id,
        Loan.status == "ACTIVE"
    ).all()

    current_emi = sum([Decimal(l.emi_amount) for l in loans])

    # =============================
    # 4️⃣ FOIR (Bank Rule)
    # =============================

    # RBI typical limit = 50%

    foir_limit = Decimal("0.50")

    max_emi_allowed = monthly_income * foir_limit

    available_emi_capacity = max_emi_allowed - current_emi

    emi_ratio = float((current_emi / monthly_income) * 100) if monthly_income else 0

    # =============================
    # 5️⃣ Liquidity Buffer
    # =============================

    buffer_months = float(total_balance / monthly_expense) if monthly_expense else 0

    recommended_buffer_months = 5

    recommended_buffer_amount = monthly_expense * recommended_buffer_months

    # =============================
    # 6️⃣ Stress Test
    # =============================

    forecast = monte_carlo_forecast(
        db=db,
        user_id=user_id,
        monthly_income=float(monthly_income),
        monthly_expenses=float(monthly_expense),
        emi=float(current_emi)
    )

    stress_probability = forecast["stress_probability_percentage"]

    # =============================
    # 7️⃣ Debt-To-Income Ratio
    # =============================

    total_outstanding = sum([Decimal(l.outstanding_balance) for l in loans])

    annual_income = monthly_income * 12

    dti_ratio = float(total_outstanding / annual_income) if annual_income else 0

    # =============================
    # 8️⃣ Loan Recommendation
    # =============================

    conservative = float(available_emi_capacity * 40)
    moderate = float(available_emi_capacity * 55)
    aggressive = float(available_emi_capacity * 75)

    # =============================
    # 9️⃣ Risk Scoring
    # =============================

    score = 100

    if emi_ratio > 50:
        score -= 30

    if buffer_months < 3:
        score -= 20

    if stress_probability > 30:
        score -= 20

    if dti_ratio > 4:
        score -= 15

    score = max(score, 0)

    # =============================
    # 🔟 Return Response
    # =============================

    return {

        "readiness_score": score,

        "monthly_income": float(monthly_income),
        "monthly_expense": float(monthly_expense),

        "current_emi": float(current_emi),
        "recommended_max_emi": float(max_emi_allowed),

        "available_capacity": float(available_emi_capacity),
        "emi_ratio": emi_ratio,

        "buffer_amount": float(total_balance),
        "buffer_months": buffer_months,
        "recommended_buffer": float(recommended_buffer_amount),

        "stress_probability": stress_probability,

        "dti_ratio": dti_ratio,

        "loan_recommendations": {
            "conservative": conservative,
            "moderate": moderate,
            "aggressive": aggressive
        }
    }