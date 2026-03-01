from sqlalchemy.orm import Session
from app.db.models import Account
from decimal import Decimal, ROUND_HALF_UP
import random
from datetime import datetime, timedelta
from collections import defaultdict


def monte_carlo_forecast(
    db: Session,
    user_id: int,
    monthly_income: float,
    monthly_expenses: float,
    emi: float,
    simulations: int = 1000
):

    monthly_income = Decimal(monthly_income)
    monthly_expenses = Decimal(monthly_expenses)

    # ---- EMI Logic (Flexible Mode) ----
    emi = Decimal(emi) if emi else Decimal(0)

    if emi <= 0:
        # Fetch Active Loan EMI from DB
        from app.db.models import Loan

        active_loans = db.query(Loan).filter(
            Loan.user_id == user_id,
            Loan.status == "ACTIVE"
        ).all()

        emi = sum([Decimal(loan.emi_amount) for loan in active_loans])

    # ---- Fetch Starting Balance ----
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    total_balance = sum([Decimal(acc.balance) for acc in accounts])

    if total_balance <= 0:
        return {
            "simulations_run": simulations,
            "survival_probability": 0,
            "bankruptcy_probability": 1,
            "average_ending_balance_6m": 0,
            "starting_balance": 0,
            "buffer_months": 0,
            "emi_burden_ratio": 0,
            "available_ratio": 0,
            "expected_stress_month": None,
            "monthly_survival_curve": []
        }

    survival_count = 0
    ending_balances = []
    failure_month_distribution = defaultdict(int)
    monthly_survival_tracker = [0] * 12  # For 12-month curve

    # ---- Run Simulations ----
    for _ in range(simulations):

        balance = Decimal(total_balance)
        survived_full_term = True

        for month in range(12):

            # Income volatility (±8%)
            income_variation = Decimal(random.uniform(0.92, 1.08))
            simulated_income = monthly_income * income_variation

            # Expense volatility (±12%)
            expense_variation = Decimal(random.uniform(0.88, 1.12))
            simulated_expense = monthly_expenses * expense_variation

            # Shock probability 7%
            shock = Decimal(0)
            if random.random() < 0.07:
                shock = Decimal(random.uniform(5000, 15000))

            net = simulated_income - simulated_expense - emi - shock
            balance += net

            if balance > 0:
                monthly_survival_tracker[month] += 1
            else:
                failure_month_distribution[month] += 1
                survived_full_term = False
                break

        if survived_full_term:
            survival_count += 1

        ending_balances.append(float(balance))

    # ---- Core Probabilities ----
    survival_probability = Decimal(survival_count) / Decimal(simulations)
    bankruptcy_probability = Decimal(1) - survival_probability

    avg_ending_balance = (
        Decimal(sum(ending_balances)) / Decimal(simulations)
    ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    # ---- Buffer Strength ----
    monthly_outflow = monthly_expenses + emi
    buffer_months = (
        (total_balance / monthly_outflow).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        if monthly_outflow > 0 else Decimal(0)
    )

    # ---- EMI Burden ----
    emi_burden_ratio = (
        (emi / monthly_income).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        if monthly_income > 0 else Decimal(0)
    )

    available_ratio = Decimal(1) - emi_burden_ratio

    # ---- Expected Stress Month ----
    expected_stress_month = None
    if failure_month_distribution:
        worst_month_index = max(
            failure_month_distribution,
            key=failure_month_distribution.get
        )
        future_date = datetime.utcnow() + timedelta(days=30 * worst_month_index)
        expected_stress_month = future_date.strftime("%B %Y")

    # ---- Monthly Survival Curve ----
    monthly_survival_curve = []
    for i in range(12):
        probability = (
            Decimal(monthly_survival_tracker[i]) / Decimal(simulations)
        ) * Decimal(100)

        month_label = (datetime.utcnow() + timedelta(days=30 * i)).strftime("%b")

        monthly_survival_curve.append({
            "month": month_label,
            "probability": float(
                probability.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
            )
        })

    return {
        # Existing fields (unchanged)
        "simulations_run": simulations,
        "survival_probability": float(
            survival_probability.quantize(Decimal("0.001"), rounding=ROUND_HALF_UP)
        ),
        "bankruptcy_probability": float(
            bankruptcy_probability.quantize(Decimal("0.001"), rounding=ROUND_HALF_UP)
        ),
        "average_ending_balance_6m": float(avg_ending_balance),
        "starting_balance": float(total_balance),

        # Newly added dashboard fields
        "stress_probability_percentage": float(
            (bankruptcy_probability * Decimal(100)).quantize(
                Decimal("0.1"), rounding=ROUND_HALF_UP
            )
        ),
        "buffer_months": float(buffer_months),
        "emi_burden_ratio": float(emi_burden_ratio),
        "available_ratio": float(available_ratio),
        "expected_stress_month": expected_stress_month,
        "monthly_survival_curve": monthly_survival_curve
    }