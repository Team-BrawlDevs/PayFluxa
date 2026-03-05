from dotenv import load_dotenv
from pathlib import Path
import os
import json
import re
import google.generativeai as genai
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.services.health_service import calculate_health_score
from app.services.risk_service import calculate_risk_profile
from app.services.monte_carlo_service import monte_carlo_forecast

from app.db.models import Account, Loan, Transaction


# -----------------------------
# ENV SETUP
# -----------------------------

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")

genai.configure(api_key=GEMINI_API_KEY)


# -----------------------------
# MAIN COPILOT FUNCTION
# -----------------------------

def generate_financial_advice(
    db: Session,
    user_id: int,
    question: str,
    chat_history=None
):

    if chat_history is None:
        chat_history = []

    # -----------------------------
    # FETCH USER ACCOUNTS
    # -----------------------------

    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    account_ids = [acc.id for acc in accounts]

    total_balance = float(sum([acc.balance for acc in accounts]))

    # -----------------------------
    # FETCH LOANS
    # -----------------------------

    loans = db.query(Loan).filter(Loan.user_id == user_id).all()

    active_loans = [loan for loan in loans if loan.status == "ACTIVE"]

    total_emi = float(sum([loan.emi_amount for loan in active_loans]))
    total_loans = float(sum([loan.principal_amount for loan in loans]))

    # -----------------------------
    # FETCH TRANSACTIONS
    # -----------------------------

    transactions = []

    if account_ids:
        transactions = db.query(Transaction).filter(
            or_(
                Transaction.from_account_id.in_(account_ids),
                Transaction.to_account_id.in_(account_ids)
            )
        ).all()

    # -----------------------------
    # ESTIMATE CASHFLOW
    # -----------------------------

    income = 0
    expenses = 0

    for t in transactions:

        tx_type = (t.transaction_type or "").lower()

        if tx_type == "deposit":
            income += float(t.amount)

        if tx_type in ["withdrawal", "emi"]:
            expenses += float(t.amount)

    # fallback values if insufficient data
    monthly_income = income if income > 0 else 50000
    monthly_expenses = expenses if expenses > 0 else 30000

    # -----------------------------
    # HEALTH + RISK
    # -----------------------------

    health = calculate_health_score(db, user_id)
    risk = calculate_risk_profile(db, user_id)

    # -----------------------------
    # MONTE CARLO FORECAST
    # -----------------------------

    mc = monte_carlo_forecast(
        db=db,
        user_id=user_id,
        monthly_income=monthly_income,
        monthly_expenses=monthly_expenses,
        emi=total_emi,
        simulations=300
    )

    # -----------------------------
    # FORMAT CHAT HISTORY
    # -----------------------------

    history_text = ""

    for h in chat_history:
        history_text += f"User: {h.get('user')}\nAdvisor: {h.get('assistant')}\n"

    # -----------------------------
    # BUILD AI PROMPT
    # -----------------------------

    prompt = f"""
You are PayFluxa Financial Copilot — an AI financial advisor used by a regulated bank.

You must provide professional financial guidance using the user's financial data.

User Financial Profile

Liquidity
- Total Balance: ₹{total_balance}

Debt
- Total Loans: ₹{total_loans}
- Active EMI Obligation: ₹{total_emi}

Cashflow
- Estimated Monthly Income: ₹{monthly_income}
- Estimated Monthly Expenses: ₹{monthly_expenses}

Financial Health
- Health Score: {health.get("health_score")}
- Risk Level: {risk.get("risk_level")}

Stress Testing
- Survival Probability (12m): {mc["survival_probability"]}
- Bankruptcy Probability: {mc["bankruptcy_probability"]}
- Buffer Months: {mc["buffer_months"]}
- EMI Burden Ratio: {mc["emi_burden_ratio"]}
- Expected Stress Month: {mc["expected_stress_month"]}

Previous Conversation
{history_text}

User Question:
"{question}"

RULES

You must behave like a professional bank financial advisor.

You must evaluate:
- loan affordability
- liquidity risk
- debt burden
- financial survival probability

Never answer unrelated topics.

Always return structured JSON.

Return EXACTLY this structure:

{{
  "analysis": "professional financial advisory explanation",

  "risk_summary": {{
      "health_score": number,
      "risk_level": "LOW or MEDIUM or HIGH",
      "survival_probability": number
  }},

  "warnings": [
      "financial risks if present"
  ],

  "recommendations": [
      "clear actionable recommendations"
  ]
}}
"""

    # -----------------------------
    # CALL GEMINI
    # -----------------------------

    model = genai.GenerativeModel("gemini-2.5-flash")

    response = model.generate_content(prompt)

    raw_text = response.text

    # -----------------------------
    # SAFE JSON EXTRACTION
    # -----------------------------

    match = re.search(r"\{.*\}", raw_text, re.DOTALL)

    if match:
        try:
            return json.loads(match.group())
        except:
            pass

    # -----------------------------
    # FALLBACK RESPONSE
    # -----------------------------

    return {
        "analysis": raw_text,

        "risk_summary": {
            "health_score": health.get("health_score"),
            "risk_level": risk.get("risk_level"),
            "survival_probability": mc["survival_probability"]
        },

        "warnings": [],

        "recommendations": []
    }