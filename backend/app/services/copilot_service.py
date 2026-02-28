from sqlalchemy.orm import Session
from app.services.health_service import calculate_health_score
from app.services.risk_service import calculate_risk_profile
from app.services.monte_carlo_service import monte_carlo_forecast
from app.db.models import Account


def generate_financial_advice(db: Session, user_id: int):

    # Fetch analytics
    health = calculate_health_score(db, user_id)
    risk = calculate_risk_profile(db, user_id)

    # Default projection assumptions
    mc = monte_carlo_forecast(
        db=db,
        user_id=user_id,
        monthly_income=50000,
        monthly_expenses=35000,
        emi=10000,
        simulations=500
    )

    # Get total balance
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    total_balance = sum([acc.balance for acc in accounts])

    advice = []
    warnings = []

    # Health-based suggestions
    if health["health_score"] < 40:
        warnings.append("Your financial health is critically low.")
        advice.append("Reduce discretionary spending immediately.")
    elif health["health_score"] < 70:
        advice.append("Improve savings rate to strengthen financial stability.")
    else:
        advice.append("Your financial health is stable. Maintain discipline.")

    # Risk-based suggestions
    if risk["risk_level"] == "HIGH":
        warnings.append("Your risk exposure is high.")
        advice.append("Avoid new loans or EMIs at this time.")
    elif risk["risk_level"] == "MEDIUM":
        advice.append("Manage liabilities carefully.")
    else:
        advice.append("Your risk profile is low.")

    # Monte Carlo survival advice
    if mc["survival_probability"] < 0.6:
        warnings.append("High probability of financial stress in 6 months.")
        advice.append("Build emergency fund covering 3–6 months expenses.")
    elif mc["survival_probability"] < 0.8:
        advice.append("Moderate survival probability. Improve liquidity.")
    else:
        advice.append("Strong financial survival outlook.")

    summary = f"""
    Financial Summary:
    - Total Balance: ₹{total_balance}
    - Health Score: {health['health_score']}
    - Risk Level: {risk['risk_level']}
    - Survival Probability (6m): {mc['survival_probability']}
    """

    return {
        "summary": summary.strip(),
        "warnings": warnings,
        "recommendations": advice
    }