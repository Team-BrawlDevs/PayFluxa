from sqlalchemy.orm import Session
from app.services.health_service import calculate_health_score
from app.services.risk_service import calculate_risk_profile
from app.db.models import Account
from decimal import Decimal


def simulate_scenario(
    db: Session,
    user_id: int,
    monthly_income: float = 0,
    monthly_expenses: float = 0,
    emi: float = 0,
    one_time_withdrawal: float = 0
):

    monthly_income = Decimal(monthly_income)
    monthly_expenses = Decimal(monthly_expenses)
    emi = Decimal(emi)
    one_time_withdrawal = Decimal(one_time_withdrawal)

    # Get total balance
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    total_balance = sum([acc.balance for acc in accounts])

    # Apply one-time withdrawal
    simulated_balance = total_balance - one_time_withdrawal

    # Monthly net flow
    monthly_net = monthly_income - monthly_expenses - emi

    # Project for 6 months
    months_survived = 0
    projection_balance = simulated_balance

    for i in range(6):
        projection_balance += monthly_net
        if projection_balance <= 0:
            break
        months_survived += 1

    # Basic survival score
    if months_survived >= 6:
        survival_status = "STABLE"
    elif months_survived >= 3:
        survival_status = "MODERATE"
    else:
        survival_status = "RISKY"

    # Current risk
    current_risk = calculate_risk_profile(db, user_id)

    return {
        "starting_balance": float(total_balance),
        "simulated_start_balance": float(simulated_balance),
        "monthly_net_cashflow": float(monthly_net),
        "projected_balance_after_6m": float(projection_balance),
        "months_survived": months_survived,
        "survival_status": survival_status,
        "current_risk_level": current_risk["risk_level"],
        "current_risk_score": current_risk["risk_score"]
    }