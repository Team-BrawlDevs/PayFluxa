from sqlalchemy.orm import Session
from app.db.models import User, Account, Loan, Transaction
from app.services.health_service import calculate_health_score
from app.services.risk_service import calculate_risk_profile
from app.services.loan_service import (
    get_total_emi_exposure,
    get_total_outstanding_exposure,
    get_active_loan_count
)
from app.services.monte_carlo_service import monte_carlo_forecast
from decimal import Decimal
from datetime import datetime, timedelta
from sqlalchemy import func
from fastapi import HTTPException


def build_portfolio_dashboard(db: Session):
    users = db.query(User).filter(User.role == "customer").all()
    accounts = db.query(Account).all()

    if not users:
        raise HTTPException(status_code=404, detail="No customers found")

    total_users = len(users)    
    total_accounts = len(accounts)

    total_system_balance = sum(
        [Decimal(acc.balance) for acc in accounts]
    ) if accounts else Decimal(0)

    # ----------------------------
    # Aggregators
    # ----------------------------
    health_scores = []

    risk_distribution = {
        "LOW": 0,
        "MEDIUM": 0,
        "HIGH": 0,
        "CRITICAL": 0
    }

    stress_distribution = {
        "0-10%": 0,
        "10-20%": 0,
        "20-30%": 0,
        "30-40%": 0,
        "40-50%": 0,
        "50%+": 0
    }

    high_risk_users = []
    portfolio_stress_probabilities = []

    six_months_ago = datetime.utcnow() - timedelta(days=180)

    # ----------------------------
    # Loop Users
    # ----------------------------
    for user in users:

        user_accounts = db.query(Account).filter(Account.user_id == user.id).all()

        if not user_accounts:
            continue

        account_ids = [acc.id for acc in user_accounts]

        # ----------------------------
        # Calculate Real Income & Expenses (6 months avg)
        # ----------------------------
        transactions = db.query(Transaction).filter(
            Transaction.created_at >= six_months_ago,
            Transaction.status == "SUCCESS",
            (
                (Transaction.from_account_id.in_(account_ids)) |
                (Transaction.to_account_id.in_(account_ids))
            )
        ).all()

        total_income = Decimal(0)
        total_expense = Decimal(0)

        for txn in transactions:
            if txn.transaction_type == "DEPOSIT":
                total_income += Decimal(txn.amount)

            if txn.transaction_type in ["WITHDRAW", "TRANSFER"]:
                total_expense += Decimal(txn.amount)

        monthly_income = total_income / Decimal(6) if total_income > 0 else Decimal(0)
        monthly_expenses = total_expense / Decimal(6) if total_expense > 0 else Decimal(0)

        # ----------------------------
        # Health
        # ----------------------------
        try:
            health_data = calculate_health_score(db, user.id)
            health_scores.append(health_data["health_score"])
        except:
            continue

        # ----------------------------
        # Risk
        # ----------------------------
        risk_data = calculate_risk_profile(db, user.id)
        risk_level = risk_data["risk_level"]
        risk_score = risk_data["risk_score"]

        if risk_level in risk_distribution:
            risk_distribution[risk_level] += 1

        if risk_level in ["HIGH", "CRITICAL"]:
            high_risk_users.append({
                "user_id": user.id,
                "risk_score": risk_score
            })

        # ----------------------------
        # EMI (Real from Loans)
        # ----------------------------
        active_loans = db.query(Loan).filter(
            Loan.user_id == user.id,
            Loan.status == "ACTIVE"
        ).all()

        total_emi = sum([Decimal(loan.emi_amount) for loan in active_loans])

        # ----------------------------
        # Monte Carlo (Real Data)
        # ----------------------------
        try:
            mc = monte_carlo_forecast(
                db=db,
                user_id=user.id,
                monthly_income=float(monthly_income),
                monthly_expenses=float(monthly_expenses),
                emi=float(total_emi),
                simulations=200
            )

            stress = mc["stress_probability_percentage"]
            portfolio_stress_probabilities.append(stress)

            # ----------------------------
            # Stress Bucket Logic
            # ----------------------------
            if stress < 10:
                stress_distribution["0-10%"] += 1
            elif stress < 20:
                stress_distribution["10-20%"] += 1
            elif stress < 30:
                stress_distribution["20-30%"] += 1
            elif stress < 40:
                stress_distribution["30-40%"] += 1
            elif stress < 50:
                stress_distribution["40-50%"] += 1
            else:
                stress_distribution["50%+"] += 1

        except:
            continue

    # ----------------------------
    # Aggregate Portfolio Metrics
    # ----------------------------

    avg_health_score = (
        round(sum(health_scores) / len(health_scores), 2)
        if health_scores else 0
    )

    avg_stress_probability = (
        round(sum(portfolio_stress_probabilities) / len(portfolio_stress_probabilities), 2)
        if portfolio_stress_probabilities else 0
    )

    # ----------------------------
    # Loan Exposure
    # ----------------------------
    total_emi_exposure = get_total_emi_exposure(db)
    total_outstanding_exposure = get_total_outstanding_exposure(db)
    active_loans = get_active_loan_count(db)

    # ----------------------------
    # Final Response
    # ----------------------------
    return {
        "total_users": total_users,
        "total_accounts": total_accounts,
        "total_system_balance": float(total_system_balance),
        "average_health_score": avg_health_score,

        "risk_distribution": risk_distribution,
        "high_risk_users": high_risk_users,

        "average_stress_probability_percentage": avg_stress_probability,
        "stress_distribution": stress_distribution,

        "loan_metrics": {
            "total_emi_exposure": total_emi_exposure,
            "total_outstanding_exposure": total_outstanding_exposure,
            "active_loans": active_loans
        }
    }