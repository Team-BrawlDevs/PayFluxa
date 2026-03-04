from sqlalchemy.orm import Session
from app.db.models import Account, Transaction, Loan
from app.services.monte_carlo_service import monte_carlo_forecast
from decimal import Decimal
from datetime import datetime, timedelta


def get_investment_advisory(db: Session, user_id: int):

    # ------------------------------------------------
    # 1. Fetch User Accounts
    # ------------------------------------------------
    accounts = db.query(Account).filter(Account.user_id == user_id).all()

    if not accounts:
        return {
            "advisory_decision": "BLOCK",
            "reason": "No financial accounts found"
        }

    account_ids = [acc.id for acc in accounts]

    total_balance = sum([Decimal(acc.balance) for acc in accounts])

    # ------------------------------------------------
    # 2. Fetch Transaction History (6 months)
    # ------------------------------------------------
    six_months_ago = datetime.utcnow() - timedelta(days=180)

    transactions = db.query(Transaction).filter(
        Transaction.created_at >= six_months_ago,
        Transaction.status == "SUCCESS",
        (
            (Transaction.from_account_id.in_(account_ids)) |
            (Transaction.to_account_id.in_(account_ids))
        )
    ).all()

    total_income = Decimal(0)
    total_expenses = Decimal(0)

    for txn in transactions:

        amount = Decimal(txn.amount)

        if txn.transaction_type == "DEPOSIT":
            total_income += amount

        if txn.transaction_type in ["WITHDRAW", "TRANSFER"]:
            total_expenses += amount

    monthly_income = total_income / Decimal(6) if total_income > 0 else Decimal(0)
    monthly_expenses = total_expenses / Decimal(6) if total_expenses > 0 else Decimal(0)

    # ------------------------------------------------
    # 3. EMI Exposure
    # ------------------------------------------------
    active_loans = db.query(Loan).filter(
        Loan.user_id == user_id,
        Loan.status == "ACTIVE"
    ).all()

    total_emi = sum([Decimal(loan.emi_amount) for loan in active_loans])

    # ------------------------------------------------
    # 4. Monthly Outflow
    # ------------------------------------------------
    monthly_outflow = monthly_expenses + total_emi

    # ------------------------------------------------
    # 5. Liquidity Buffer
    # ------------------------------------------------
    buffer_months = (
        total_balance / monthly_outflow
        if monthly_outflow > 0 else Decimal(0)
    )

    # ------------------------------------------------
    # 6. Debt Service Ratio
    # ------------------------------------------------
    dsr = (
        total_emi / monthly_income
        if monthly_income > 0 else Decimal(1)
    )

    # ------------------------------------------------
    # 7. Monthly Surplus
    # ------------------------------------------------
    monthly_surplus = monthly_income - monthly_expenses - total_emi

    # ------------------------------------------------
    # 8. Monte Carlo Stress Simulation
    # ------------------------------------------------
    try:
        mc = monte_carlo_forecast(
            db=db,
            user_id=user_id,
            monthly_income=float(monthly_income),
            monthly_expenses=float(monthly_expenses),
            emi=float(total_emi),
            simulations=400
        )

        stress_probability = mc["stress_probability_percentage"]

    except Exception:
        stress_probability = 100

    # ------------------------------------------------
    # 9. Safety Reserve Rule
    # ------------------------------------------------
    minimum_reserve = monthly_outflow * Decimal(2)

    excess_liquidity = total_balance - minimum_reserve

    # ------------------------------------------------
    # 10. Investment Limit Calculation
    # ------------------------------------------------
    if monthly_surplus > 0 and excess_liquidity > 0:

        investment_limit = min(
            monthly_surplus * Decimal("0.25"),
            excess_liquidity * Decimal("0.40")
        )

    else:
        investment_limit = Decimal(0)

    # ------------------------------------------------
    # 11. Policy Decision Engine
    # ------------------------------------------------
    decision = "ALLOW"

    risk_flags = []

    if buffer_months < 1:
        decision = "BLOCK"
        risk_flags.append("LOW_LIQUIDITY")

    if dsr > Decimal("0.5"):
        decision = "BLOCK"
        risk_flags.append("HIGH_DEBT")

    if stress_probability > 40:
        decision = "BLOCK"
        risk_flags.append("HIGH_STRESS")

    if decision != "BLOCK":

        if buffer_months < 3:
            decision = "CAUTION"
            risk_flags.append("MODERATE_BUFFER")

        if stress_probability > 25:
            decision = "CAUTION"
            risk_flags.append("ELEVATED_STRESS")

    # ------------------------------------------------
    # 12. Response
    # ------------------------------------------------
    return {

        "advisory_decision": decision,

        "recommended_investment": float(investment_limit),

        "analysis": {

            "monthly_income": float(monthly_income),

            "monthly_expenses": float(monthly_expenses),

            "emi": float(total_emi),

            "monthly_surplus": float(monthly_surplus),

            "liquidity_buffer_months": float(buffer_months),

            "debt_service_ratio": float(dsr),

            "stress_probability": stress_probability,

            "account_balance": float(total_balance)

        },

        "risk_flags": risk_flags,

        "policy": "PAYFLUXA_INVESTMENT_POLICY_V1"
    }