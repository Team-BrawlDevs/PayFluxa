from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime, timedelta
from decimal import Decimal

from app.db.models import Account, Loan, Transaction, FinancialAlert
from app.services.health_service import calculate_health_score
from app.services.risk_service import calculate_risk_profile
from app.services.monte_carlo_service import monte_carlo_forecast


def generate_alerts(db: Session, user_id: int):

    alerts = []

    # --------------------------------
    # Accounts
    # --------------------------------

    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    account_ids = [a.id for a in accounts]

    balance = sum([Decimal(a.balance or 0) for a in accounts])

    # --------------------------------
    # Transactions (6 months)
    # --------------------------------

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
    expense = Decimal(0)

    for txn in txns:
        if txn.transaction_type == "DEPOSIT":
            income += Decimal(txn.amount)

        elif txn.transaction_type == "WITHDRAW":
            expense += Decimal(txn.amount)

    monthly_income = income / 6 if income else 0
    monthly_expense = expense / 6 if expense else 0

    # --------------------------------
    # Buffer Alert
    # --------------------------------

    if monthly_expense > 0:
        buffer_months = float(balance / monthly_expense)

        if buffer_months < 5:
            alerts.append({
                "severity": "high",
                "title": "Low Financial Buffer",
                "description": f"Your financial buffer is {round(buffer_months,2)} months, below recommended 5 months.",
                "category": "Buffer Management"
            })

    # --------------------------------
    # EMI Burden
    # --------------------------------

    loans = db.query(Loan).filter(
        Loan.user_id == user_id,
        Loan.status == "ACTIVE"
    ).all()

    total_emi = sum([Decimal(l.emi_amount) for l in loans])

    if monthly_income > 0:

        emi_ratio = float(total_emi / monthly_income * 100)

        if emi_ratio > 40:
            alerts.append({
                "severity": "medium",
                "title": "EMI Burden Above Optimal Level",
                "description": f"Your EMI burden is {round(emi_ratio,1)}% of income.",
                "category": "EMI Management"
            })

    # --------------------------------
    # Health Score Trend
    # --------------------------------

    health = calculate_health_score(db, user_id)

    trend = health.get("historical_trend", [])

    if len(trend) >= 2:

        if trend[-1]["score"] < trend[-2]["score"]:

            alerts.append({
                "severity": "medium",
                "title": "Resilience Score Decline",
                "description": "Your resilience score has declined recently.",
                "category": "Resilience Monitoring"
            })

    # --------------------------------
    # Stress Probability
    # --------------------------------

    forecast = monte_carlo_forecast(
        db=db,
        user_id=user_id,
        monthly_income=float(monthly_income),
        monthly_expenses=float(monthly_expense),
        emi=float(total_emi)
    )

    stress = forecast.get("stress_probability_percentage", 0)

    if stress > 20:

        alerts.append({
            "severity": "high",
            "title": "Stress Event Probability Increase",
            "description": f"Stress probability increased to {stress}%.",
            "category": "Risk Assessment"
        })

    # --------------------------------
    # Save alerts
    # --------------------------------

    for alert in alerts:

        existing = db.query(FinancialAlert).filter(
            FinancialAlert.user_id == user_id,
            FinancialAlert.title == alert["title"],
            FinancialAlert.is_read == False
        ).first()

        if not existing:
            db_alert = FinancialAlert(
                user_id=user_id,
                severity=alert["severity"],
                title=alert["title"],
                description=alert["description"],
                category=alert["category"]
            )

            db.add(db_alert)

    db.commit()

    return alerts