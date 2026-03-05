from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Loan
from app.core.rbac import get_current_user

router = APIRouter(prefix="/customer", tags=["Customer"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/emis")
def get_customer_emis(db: Session = Depends(get_db), user=Depends(get_current_user)):
    
    loans = db.query(Loan).filter(Loan.user_id == user.id).all()

    result = []

    for loan in loans:
        result.append({
            "loan_id": loan.id,
            "principal_amount": loan.principal_amount,
            "interest_rate": loan.interest_rate,
            "tenure_months": loan.tenure_months,
            "emi_amount": loan.emi_amount,
            "outstanding_balance": loan.outstanding_balance,
            "status": loan.status
        })

    return result