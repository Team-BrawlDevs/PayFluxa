from sqlalchemy.orm import Session
from app.db.models import Account
from decimal import Decimal
import random


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
    emi = Decimal(emi)

    # Get starting balance
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    total_balance = sum([acc.balance for acc in accounts])

    survival_count = 0
    ending_balances = []

    for _ in range(simulations):

        balance = Decimal(total_balance)

        for month in range(6):

            # Randomize income ±10%
            income_variation = Decimal(random.uniform(0.9, 1.1))
            simulated_income = monthly_income * income_variation

            # Randomize expenses ±15%
            expense_variation = Decimal(random.uniform(0.85, 1.15))
            simulated_expense = monthly_expenses * expense_variation

            # Random shock (10% chance)
            shock = Decimal(0)
            if random.random() < 0.1:
                shock = Decimal(random.uniform(5000, 20000))

            net = simulated_income - simulated_expense - emi - shock
            balance += net

            if balance <= 0:
                break

        if balance > 0:
            survival_count += 1

        ending_balances.append(float(balance))

    survival_probability = round(survival_count / simulations, 3)
    bankruptcy_probability = round(1 - survival_probability, 3)

    avg_ending_balance = round(sum(ending_balances) / simulations, 2)

    return {
        "simulations_run": simulations,
        "survival_probability": survival_probability,
        "bankruptcy_probability": bankruptcy_probability,
        "average_ending_balance_6m": avg_ending_balance,
        "starting_balance": float(total_balance)
    }