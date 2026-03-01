from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.db.models import Loan, LoanRestructuringCase, Transaction, Account, AuditLog
from app.services.monte_carlo_service import monte_carlo_forecast
from datetime import datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP
import uuid


def generate_restructuring_case(db: Session, loan_id: int, admin_id: int):

    loan = db.query(Loan).filter(
        Loan.id == loan_id,
        Loan.status == "ACTIVE"
    ).first()

    if not loan:
        return {"message": "Active loan not found"}

    user_id = loan.user_id

    # ---- Get User Accounts ----
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    account_ids = [acc.id for acc in accounts]

    if not account_ids:
        return {"message": "No accounts found"}

    # ---- Last 6 Months Transactions ----
    six_months_ago = datetime.utcnow() - timedelta(days=180)

    transactions = db.query(Transaction).filter(
        Transaction.created_at >= six_months_ago,
        Transaction.status == "SUCCESS",
        or_(
            Transaction.from_account_id.in_(account_ids),
            Transaction.to_account_id.in_(account_ids)
        )
    ).all()

    total_income = Decimal(0)
    total_expense = Decimal(0)

    for txn in transactions:
        amount = Decimal(txn.amount)

        if txn.transaction_type == "DEPOSIT":
            total_income += amount

        elif txn.transaction_type == "WITHDRAW":
            total_expense += amount

    avg_monthly_income = (
        total_income / Decimal(6) if total_income > 0 else Decimal(0)
    )

    avg_monthly_expense = (
        total_expense / Decimal(6) if total_expense > 0 else Decimal(0)
    )

    # ---- Run Monte Carlo ----
    forecast = monte_carlo_forecast(
        db=db,
        user_id=user_id,
        monthly_income=float(avg_monthly_income),
        monthly_expenses=float(avg_monthly_expense),
        emi=float(loan.emi_amount)
    )

    stress_probability = Decimal(
        forecast["stress_probability_percentage"]
    )

    # ---- If Not Risky Enough ----
    if stress_probability < Decimal(25):
        return {"message": "Loan does not require restructuring"}

    # ---- Recommend New Tenure (+ 60 months) ----
    recommended_tenure = loan.tenure_months + 60

    # Reduce EMI by 20%
    recommended_emi = (
        Decimal(loan.emi_amount) * Decimal("0.80")
    ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    # ---- Estimate Stress After ----
    improved_forecast = monte_carlo_forecast(
        db=db,
        user_id=user_id,
        monthly_income=float(avg_monthly_income),
        monthly_expenses=float(avg_monthly_expense),
        emi=float(recommended_emi)
    )

    stress_after = Decimal(
        improved_forecast["stress_probability_percentage"]
    )

    # ---- Create Case ----
    case = LoanRestructuringCase(
        case_id=f"RST-{datetime.utcnow().year}-{uuid.uuid4().hex[:6]}",
        user_id=user_id,
        loan_id=loan.id,

        current_emi=loan.emi_amount,
        current_tenure_months=loan.tenure_months,
        current_risk_level="HIGH",

        recommended_emi=recommended_emi,
        recommended_tenure_months=recommended_tenure,
        recommended_risk_level="MEDIUM",

        stress_probability_before=stress_probability,
        stress_probability_after=stress_after,

        resilience_score_before=0,
        resilience_score_after=0,

        buffer_before=Decimal(forecast["buffer_months"]),
        buffer_after=Decimal(improved_forecast["buffer_months"]),

        additional_interest_cost=Decimal("0"),
        status="GENERATED"
    )

    db.add(case)

    # ---- Audit Log ----
    audit = AuditLog(
        user_id=admin_id,
        role="admin",
        action_type="LOAN_RESTRUCTURE_GENERATED",
        entity_type="loan",
        entity_id=loan.id,
        timestamp=datetime.utcnow(),
        details=f"Restructure case generated: {case.case_id}"
    )

    db.add(audit)

    db.commit()

    return {
        "message": "Restructuring case generated successfully",
        "case_id": case.case_id
    }