from sqlalchemy.orm import Session
from app.db.models import Loan
from decimal import Decimal


# -------------------------------
# 1️⃣ Get total EMI exposure
# -------------------------------
def get_total_emi_exposure(db: Session):

    active_loans = (
        db.query(Loan)
        .filter(Loan.status == "ACTIVE")
        .all()
    )

    total_emi = sum(
        [Decimal(loan.emi_amount) for loan in active_loans]
    ) if active_loans else Decimal(0)

    return float(total_emi)


# -------------------------------
# 2️⃣ Get total outstanding balance
# -------------------------------
def get_total_outstanding_exposure(db: Session):

    active_loans = (
        db.query(Loan)
        .filter(Loan.status == "ACTIVE")
        .all()
    )

    total_outstanding = sum(
        [Decimal(loan.outstanding_balance) for loan in active_loans]
    ) if active_loans else Decimal(0)

    return float(total_outstanding)


# -------------------------------
# 3️⃣ Active loan count
# -------------------------------
def get_active_loan_count(db: Session):

    return (
        db.query(Loan)
        .filter(Loan.status == "ACTIVE")
        .count()
    )


# -------------------------------
# 4️⃣ Per user EMI exposure
# -------------------------------
def get_user_emi(db: Session, user_id: int):

    loans = (
        db.query(Loan)
        .filter(
            Loan.user_id == user_id,
            Loan.status == "ACTIVE"
        )
        .all()
    )

    total_emi = sum(
        [Decimal(loan.emi_amount) for loan in loans]
    ) if loans else Decimal(0)

    return float(total_emi)