from sqlalchemy.orm import Session
from app.services.health_service import calculate_health_score
from app.services.risk_service import calculate_risk_profile
from app.db.models import Transaction, Account
from datetime import datetime, timedelta
from decimal import Decimal


def generate_insights(db: Session, user_id: int):

    insights = []

    # Get health and risk data
    health_data = calculate_health_score(db, user_id)
    risk_data = calculate_risk_profile(db, user_id)

    health_score = health_data["health_score"]
    risk_level = risk_data["risk_level"]

    # 1️⃣ Health Insights
    if health_score >= 80:
        insights.append({
            "type": "positive",
            "message": "Your financial health is strong and well-balanced."
        })
    elif health_score < 50:
        insights.append({
            "type": "risk",
            "message": "Your financial health is below optimal levels."
        })

    # 2️⃣ Risk Alerts
    if risk_level in ["HIGH", "CRITICAL"]:
        insights.append({
            "type": "risk",
            "message": f"Your current risk level is {risk_level}. Consider reducing discretionary spending."
        })

    # 3️⃣ Recent Spending Trend (Last 30 Days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)

    recent_txns = db.query(Transaction).filter(
        Transaction.created_at >= thirty_days_ago
    ).all()

    total_withdrawals = Decimal(0)
    for txn in recent_txns:
        if txn.transaction_type in ["WITHDRAW", "TRANSFER"]:
            total_withdrawals += txn.amount

    if total_withdrawals > 0:
        insights.append({
            "type": "trend",
            "message": f"You spent ₹{round(total_withdrawals, 2)} in the last 30 days."
        })

    # 4️⃣ Liquidity Check
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    total_balance = sum([acc.balance for acc in accounts])

    if total_balance < total_withdrawals:
        insights.append({
            "type": "risk",
            "message": "Your recent spending exceeds your available balance. Monitor your cash flow closely."
        })

    # 5️⃣ Recommendation
    if risk_level in ["HIGH", "CRITICAL"]:
        insights.append({
            "type": "recommendation",
            "message": "Build an emergency buffer equivalent to 3 months of expenses."
        })
    else:
        insights.append({
            "type": "recommendation",
            "message": "Maintain your savings discipline to further improve your financial resilience."
        })

    return {
        "health_score": health_score,
        "risk_level": risk_level,
        "insights": insights
    }