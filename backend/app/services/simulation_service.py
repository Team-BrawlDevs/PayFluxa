from sqlalchemy.orm import Session
from app.services.health_service import calculate_health_score
from app.services.monte_carlo_service import monte_carlo_forecast
from app.db.models import Account
from decimal import Decimal, ROUND_HALF_UP
from math import pow


def simulate_scenario(
    db: Session,
    user_id: int,
    loan_amount: float,
    tenure_months: int,
    interest_rate: float,
    income_drop_percent: float = 0,
    include_shock: bool = False
):

    loan_amount = Decimal(loan_amount)
    tenure_months = int(tenure_months)
    interest_rate = Decimal(interest_rate) / Decimal(100)
    income_drop_percent = Decimal(income_drop_percent) / Decimal(100)

    # ---- Fetch Accounts ----
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    total_balance = sum([Decimal(acc.balance) for acc in accounts])

    # ---- Get Baseline Health ----
    baseline_health = calculate_health_score(db, user_id)

    # ---- Derive Avg Monthly Income & Expense From Health Engine ----
    avg_monthly_expense = Decimal(baseline_health["components"]["liquidity_score"])  # placeholder use
    avg_monthly_income = avg_monthly_expense * Decimal(1.4)  # assumption ratio

    # ---- EMI Calculation (Standard Formula) ----
    monthly_rate = interest_rate / Decimal(12)

    emi = (
        loan_amount *
        monthly_rate *
        Decimal(pow(1 + monthly_rate, tenure_months))
    ) / (
        Decimal(pow(1 + monthly_rate, tenure_months)) - 1
    )

    emi = emi.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    # ---- Apply Income Drop ----
    projected_income = avg_monthly_income * (Decimal(1) - income_drop_percent)

    # ---- Optional Shock ----
    shock_amount = Decimal(50000) if include_shock else Decimal(0)

    # ---- Baseline Monte Carlo ----
    baseline_mc = monte_carlo_forecast(
        db,
        user_id,
        float(avg_monthly_income),
        float(avg_monthly_expense),
        0,
        simulations=1000
    )

    # ---- Projected Monte Carlo ----
    projected_mc = monte_carlo_forecast(
        db,
        user_id,
        float(projected_income),
        float(avg_monthly_expense),
        float(emi),
        simulations=1000
    )

    # ---- Projected Resilience Recalculation ----
    projected_health_score = max(
        baseline_health["health_score"] - (projected_mc["stress_probability_percentage"] * 0.4),
        0
    )

    # ---- Deltas ----
    stress_delta = projected_mc["stress_probability_percentage"] - baseline_mc["stress_probability_percentage"]
    buffer_delta = projected_mc["buffer_months"] - baseline_mc["buffer_months"]
    if projected_income > 0:
        emi_burden = float(
            ((emi / projected_income) * 100).quantize(
                Decimal("0.1"),
                rounding=ROUND_HALF_UP
            )
        )
    else:
        emi_burden = 100.0  # If no income, EMI burden = fully stressed

    # ---- Impact Classification ----
    if stress_delta > 15:
        risk_level = "HIGH RISK INCREASE"
    elif stress_delta > 7:
        risk_level = "MODERATE RISK INCREASE"
    else:
        risk_level = "MINIMAL IMPACT"

    # ---- Recommendation Logic ----
    if emi_burden > 50:
        recommendation = "EMI burden exceeds safe threshold. Consider increasing tenure."
    elif buffer_delta < -1:
        recommendation = "Financial buffer reduces significantly. Consider reducing loan amount."
    else:
        recommendation = "Loan structure within acceptable resilience limits."

    return {

        "current_state": {
            "stress_probability": baseline_mc["stress_probability_percentage"],
            "buffer_months": baseline_mc["buffer_months"],
            "emi_burden_percent": baseline_mc["emi_burden_ratio"] * 100,
            "resilience_score": baseline_health["health_score"]
        },

        "projected_state": {
            "stress_probability": projected_mc["stress_probability_percentage"],
            "buffer_months": projected_mc["buffer_months"],
            "emi_burden_percent": emi_burden,
            "resilience_score": round(projected_health_score, 1)
        },

        "impact_metrics": {
            "stress_change": round(stress_delta, 1),
            "buffer_change": round(buffer_delta, 1),
            "risk_impact_level": risk_level
        },

        "recommendation": recommendation
    }