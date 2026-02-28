from sqlalchemy.orm import Session
from app.services.health_service import calculate_health_score
from app.db.models import Transaction, Account
from datetime import datetime, timedelta
from decimal import Decimal


def calculate_risk_profile(db: Session, user_id: int):

    # Get health score first
    health_data = calculate_health_score(db, user_id)
    health_score = health_data["health_score"]

    # Last 90 days analysis
    ninety_days_ago = datetime.utcnow() - timedelta(days=90)

    recent_transactions = db.query(Transaction).filter(
        Transaction.created_at >= ninety_days_ago
    ).all()

    failed_count = 0
    withdrawal_pressure = Decimal(0)

    for txn in recent_transactions:
        if txn.status == "FAILED":
            failed_count += 1

        if txn.transaction_type in ["WITHDRAW", "TRANSFER"]:
            withdrawal_pressure += txn.amount

    # Get total balance
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    total_balance = sum([acc.balance for acc in accounts])

    # ---- Risk Components ----

    # 1. Health inversion (low health = high risk)
    health_risk = 100 - health_score

    # 2. Failure penalty
    failure_risk = min(failed_count * 5, 20)

    # 3. Withdrawal pressure ratio
    pressure_ratio = (
        withdrawal_pressure / total_balance
        if total_balance > 0 else Decimal(1)
    )

    pressure_risk = min(float(pressure_ratio * 30), 30)

    # ---- Final Risk Score ----
    risk_score = round(
        health_risk * 0.5 +
        failure_risk +
        pressure_risk,
        2
    )

    # ---- Risk Classification ----
    if risk_score < 25:
        level = "LOW"
        default_prob = 0.05
    elif risk_score < 50:
        level = "MEDIUM"
        default_prob = 0.15
    elif risk_score < 75:
        level = "HIGH"
        default_prob = 0.35
    else:
        level = "CRITICAL"
        default_prob = 0.65

    return {
        "risk_score": min(risk_score, 100),
        "risk_level": level,
        "default_probability": default_prob,
        "health_score": health_score,
        "failed_transactions_90d": failed_count
    }