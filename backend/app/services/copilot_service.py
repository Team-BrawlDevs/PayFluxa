import json
import re
import os
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import or_
import google.generativeai as genai
from dotenv import load_dotenv

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
# BANK-GRADE MASKING
# -----------------------------
def mask_sensitive_text(text: str) -> str:
    if not text: 
        return ""
    text = re.sub(r'[\w\.-]+@[\w\.-]+', '[EMAIL_REDACTED]', text)
    text = re.sub(r'\b\d{10}\b', '[PHONE_REDACTED]', text)
    text = re.sub(r'\b\d{12,16}\b', '[ACCOUNT_REDACTED]', text)
    text = re.sub(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b', '[PAN_REDACTED]', text)
    return text

def obscure_financials(amount: float) -> float:
    return round(float(amount), -3)

# -----------------------------
# MAIN COPILOT FUNCTION
# -----------------------------
def generate_financial_advice(db: Session, user_id: int, question: str, chat_history=None):
    if chat_history is None:
        chat_history = []

    # 1. Fetch Accounts & Loans
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    account_ids = [acc.id for acc in accounts]
    total_balance = sum([acc.balance for acc in accounts])

    loans = db.query(Loan).filter(Loan.user_id == user_id).all()
    active_loans = [loan for loan in loans if loan.status == "ACTIVE"]
    total_emi = sum([loan.emi_amount for loan in active_loans])
    total_loans = sum([loan.principal_amount for loan in loans])

    # 2. Fetch Transactions (Limited for Memory Safety)
    transactions = []
    if account_ids:
        transactions = db.query(Transaction).filter(
            or_(
                Transaction.from_account_id.in_(account_ids),
                Transaction.to_account_id.in_(account_ids)
            )
        ).order_by(Transaction.created_at.desc()).limit(100).all()

    # 3. Calculate True Cashflow (Double-Entry Logic)
    income, expenses = 0.0, 0.0
    for t in transactions:
        if (t.status or "").lower() != "success":
            continue

        is_from_user = t.from_account_id in account_ids
        is_to_user = t.to_account_id in account_ids

        if is_from_user and is_to_user:
            continue
        if is_from_user:
            expenses += float(t.amount)
        if is_to_user:
            income += float(t.amount)

    monthly_income = income if income > 0 else 50000
    monthly_expenses = expenses if expenses > 0 else 30000

    # 4. Fetch Twin Metrics
    health = calculate_health_score(db, user_id)
    risk = calculate_risk_profile(db, user_id)
    mc = monte_carlo_forecast(db, user_id, monthly_income, monthly_expenses, total_emi, 300)

    # 5. Apply Data Masking
    safe_question = mask_sensitive_text(question)
    
    history_text = ""
    for h in chat_history[-3:]: # Limit context window to last 3 interactions
        safe_user = mask_sensitive_text(h.get('user', ''))
        history_text += f"User: {safe_user}\nAdvisor: {h.get('assistant', '')}\n"

    safe_balance = obscure_financials(total_balance)
    safe_loans = obscure_financials(total_loans)
    safe_emi = obscure_financials(total_emi)
    safe_income = obscure_financials(monthly_income)
    safe_expenses = obscure_financials(monthly_expenses)

    # 6. Build AI Prompt
    prompt = f"""
    You are the PayFluxa Financial Copilot, an expert conversational AI for a regulated bank.
    Your domain spans LOANS, DEBT RESTRUCTURING, INVESTMENTS, and WEALTH BUILDING.

    User's Masked Financial Profile (Ratios remain accurate):
    - Liquidity (Balance): ₹{safe_balance}
    - Debt (Total Loans): ₹{safe_loans} | Active EMI: ₹{safe_emi}
    - Cashflow: Income: ₹{safe_income}/mo | Expenses: ₹{safe_expenses}/mo
    - Health Score: {health.get("health_score", 0)} | Risk Level: {risk.get("risk_level", "UNKNOWN")}
    - Survival Probability: {mc.get("survival_probability", 0)}

    Previous Conversation:
    {history_text}

    Current User Message: "{safe_question}"

    RULES:
    1. CONVERSATIONAL: If the user greets you, reply warmly in the "message" field. Do not force financial warnings if unprompted.
    2. ANALYTICAL: If the user asks about loans or investments, provide a highly analytical, data-driven answer based on their cashflow.
    3. INVESTMENTS: Provide diversified investment strategies utilizing their surplus cashflow (Income - Expenses - EMI). 
    4. MUST RETURN ONLY VALID JSON.

    RETURN EXACTLY THIS STRUCTURE:
    {{
      "message": "Your conversational reply to the user. Write clearly, using Markdown if necessary.",
      "metrics": {{
          "health_score": {health.get("health_score", 0)},
          "survival_probability": {mc.get("survival_probability", 0)}
      }},
      "warnings": ["Array of short financial risks based on the specific query. Empty if none."],
      "recommendations": ["Array of distinct, actionable financial steps."]
    }}
    """

    # 7. Call Gemini Native JSON
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )

    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return {
            "message": "I encountered a minor error retrieving your live data. Could you rephrase your question?",
            "metrics": None,
            "warnings": [],
            "recommendations": []
        }