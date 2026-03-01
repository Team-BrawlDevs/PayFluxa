from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.services.admin_analytics_service import get_portfolio_overview
from app.core.rbac import require_role
from app.services.restructuring_service import generate_restructuring_case
router = APIRouter(prefix="/admin", tags=["Admin"])
from app.db.models import Loan, LoanRestructuringCase, AuditLog
from datetime import datetime
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/portfolio")
def portfolio_analytics(
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin"))  # lowercase as per your DB
):
    return get_portfolio_overview(db)
@router.post("/restructuring/generate/{loan_id}")
def generate_case(
    loan_id: int,
    db: Session = Depends(get_db),
    admin = Depends(require_role("admin"))
):
    return generate_restructuring_case(
        db=db,
        loan_id=loan_id,
        admin_id=admin.id
    )

@router.post("/restructuring/{case_id}/approve")
def approve_restructure(
    case_id: str,
    comments: str = "",
    db: Session = Depends(get_db),
    admin = Depends(require_role("admin"))
):
    case = db.query(LoanRestructuringCase).filter(
        LoanRestructuringCase.case_id == case_id
    ).first()

    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if case.status != "GENERATED":
        raise HTTPException(status_code=400, detail="Case already processed")

    loan = db.query(Loan).filter(
        Loan.id == case.loan_id,
        Loan.status == "ACTIVE"
    ).first()

    if not loan:
        raise HTTPException(status_code=404, detail="Active loan not found")

    try:
        # ---- Update Loan ----
        loan.emi_amount = case.recommended_emi
        loan.tenure_months = case.recommended_tenure_months

        # ---- Update Case ----
        case.status = "APPROVED"
        case.reviewed_by = admin.id
        case.reviewed_at = datetime.utcnow()
        case.admin_comments = comments

        # ---- Audit Log ----
        audit = AuditLog(
            user_id=admin.id,
            role="admin",
            action_type="LOAN_RESTRUCTURE_APPROVED",
            entity_type="loan",
            entity_id=loan.id,
            timestamp=datetime.utcnow(),
            details=f"Approved restructuring case {case.case_id}"
        )

        db.add(audit)

        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Loan restructuring approved successfully"}

@router.post("/restructuring/{case_id}/reject")
def reject_restructure(
    case_id: str,
    comments: str = "",
    db: Session = Depends(get_db),
    admin = Depends(require_role("admin"))
):
    case = db.query(LoanRestructuringCase).filter(
        LoanRestructuringCase.case_id == case_id
    ).first()

    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if case.status != "GENERATED":
        raise HTTPException(status_code=400, detail="Case already processed")

    try:
        case.status = "REJECTED"
        case.reviewed_by = admin.id
        case.reviewed_at = datetime.utcnow()
        case.admin_comments = comments

        audit = AuditLog(
            user_id=admin.id,
            role="admin",
            action_type="LOAN_RESTRUCTURE_REJECTED",
            entity_type="loan",
            entity_id=case.loan_id,
            timestamp=datetime.utcnow(),
            details=f"Rejected restructuring case {case.case_id}"
        )

        db.add(audit)

        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Restructuring rejected successfully"}