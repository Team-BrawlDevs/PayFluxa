from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.core.rbac import get_current_user
from app.services.health_service import calculate_health_score
from app.services.risk_service import calculate_risk_profile
from app.services.insight_service import generate_insights
from app.services.simulation_service import simulate_scenario
from fastapi import Body
from app.services.monte_carlo_service import monte_carlo_forecast
from app.services.copilot_service import generate_financial_advice
from app.services.fraud_service import detect_fraud

router = APIRouter(prefix="/analytics", tags=["Analytics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/health-score")
def get_health_score(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return calculate_health_score(db, user.id)

@router.get("/risk-profile")
def get_risk_profile(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return calculate_risk_profile(db, user.id)

@router.get("/insights")
def get_insights(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return generate_insights(db, user.id)

@router.post("/simulate")
def simulate_financial_scenario(
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    monthly_income: float = Body(0),
    monthly_expenses: float = Body(0),
    emi: float = Body(0),
    one_time_withdrawal: float = Body(0)
):
    return simulate_scenario(
        db=db,
        user_id=user.id,
        monthly_income=monthly_income,
        monthly_expenses=monthly_expenses,
        emi=emi,
        one_time_withdrawal=one_time_withdrawal
    )

# @router.post("/monte-carlo")
# def run_monte_carlo(
#     db: Session = Depends(get_db),
#     user = Depends(get_current_user),
#     monthly_income: float = Body(...),
#     monthly_expenses: float = Body(...),
#     emi: float = Body(...),
#     simulations: int = Body(1000)
# ):
#     return monte_carlo_forecast(
#         db=db,
#         user_id=user.id,
#         monthly_income=monthly_income,
#         monthly_expenses=monthly_expenses,
#         emi=emi,
#         simulations=simulations
#     )

@router.get("/monte-carlo")
def get_monte_carlo_summary(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return monte_carlo_forecast(
        db=db,
        user_id=user.id,
        monthly_income=0,
        monthly_expenses=0,
        emi=0,
        simulations=1000
    )
    
@router.get("/copilot")
def run_copilot(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return generate_financial_advice(db, user.id)

@router.get("/fraud-check")
def run_fraud_detection(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return detect_fraud(db, user.id)