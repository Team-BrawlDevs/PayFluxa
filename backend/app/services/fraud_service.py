from sqlalchemy.orm import Session
from app.db.models import Transaction
from datetime import datetime, timedelta
from decimal import Decimal


def detect_fraud(db: Session, user_id: int):

    transactions = (
        db.query(Transaction)
        .filter(Transaction.from_account_id == user_id)
        .order_by(Transaction.created_at.desc())
        .all()
    )

    if not transactions:
        return {"fraud_score": 0, "flags": [], "risk_level": "LOW"}

    flags = []
    fraud_score = 0

    # -----------------------------
    # 1. Amount anomaly detection
    # -----------------------------
    amounts = [Decimal(t.amount) for t in transactions]
    avg_amount = sum(amounts) / len(amounts)

    for txn in transactions[:5]:  # check recent 5
        if Decimal(txn.amount) > avg_amount * 3:
            flags.append("Unusual large transaction detected.")
            fraud_score += 30
            break

    # -----------------------------
    # 2. Frequency spike detection
    # -----------------------------
    now = datetime.utcnow()
    ten_minutes_ago = now - timedelta(minutes=10)

    recent_txns = [
        t for t in transactions if t.created_at >= ten_minutes_ago
    ]

    if len(recent_txns) > 5:
        flags.append("High transaction frequency detected.")
        fraud_score += 25

    # -----------------------------
    # 3. Rapid withdrawals
    # -----------------------------
    fifteen_minutes_ago = now - timedelta(minutes=15)

    withdrawal_txns = [
        t for t in transactions
        if t.transaction_type == "WITHDRAW"
        and t.created_at >= fifteen_minutes_ago
    ]

    if len(withdrawal_txns) >= 3:
        flags.append("Rapid multiple withdrawals detected.")
        fraud_score += 35

    # Cap fraud score
    fraud_score = min(fraud_score, 100)

    # Risk level
    if fraud_score >= 70:
        risk_level = "HIGH"
    elif fraud_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "fraud_score": fraud_score,
        "risk_level": risk_level,
        "flags": flags
    }