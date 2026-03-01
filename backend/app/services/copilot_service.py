from dotenv import load_dotenv
from pathlib import Path
import os
import json
import re
import google.generativeai as genai
from sqlalchemy.orm import Session
from app.services.health_service import calculate_health_score
from app.services.risk_service import calculate_risk_profile
from app.services.monte_carlo_service import monte_carlo_forecast
from app.db.models import Account


# Load .env from backend root
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")

genai.configure(api_key=GEMINI_API_KEY)



def generate_financial_advice(db: Session, user_id: int, question: str):

    # Fetch analytics
    health = calculate_health_score(db, user_id)
    risk = calculate_risk_profile(db, user_id)
    mc = monte_carlo_forecast(
        db=db,
        user_id=user_id,
        monthly_income=50000,
        monthly_expenses=35000,
        emi=10000,
        simulations=200
    )

    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    total_balance = sum(acc.balance for acc in accounts)

    prompt = f"""
You are PayFluxa Financial Copilot, a fintech advisory AI.

You MUST answer ONLY in the context of the user's financial analytics.

User Financial Profile:
- Total Balance: ₹{total_balance}
- Health Score: {health['health_score']}
- Risk Level: {risk['risk_level']}
- Survival Probability (6m): {mc['survival_probability']}

User Question:
"{question}"

RULES:
1. Always respond as a financial advisor.
2. Base your answer strictly on the financial metrics above.
3. Even if the question is general (e.g., "Can I take loan now?"),
   provide structured financial assessment.
4. Never answer unrelated topics.
5. Never act as a general chatbot.
6. Always return structured JSON.

Return EXACTLY this structure:

{{
  "analysis": "Professional advisory explanation paragraph",
  "risk_summary": {{
      "health_score": number,
      "risk_level": "LOW or MEDIUM or HIGH",
      "survival_probability": number
  }},
  "warnings": ["financial risk warnings if any"],
  "recommendations": ["clear actionable financial recommendations"]
}}
"""

    model = genai.GenerativeModel("gemini-2.5-flash")

    response = model.generate_content(prompt)

    raw_text = response.text

    # Extract JSON safely
    match = re.search(r"\{.*\}", raw_text, re.DOTALL)

    if match:
        try:
            return json.loads(match.group())
        except:
            pass

    # Fallback
    return {
        "analysis": raw_text,
        "risk_summary": {
            "health_score": health["health_score"],
            "risk_level": risk["risk_level"],
            "survival_probability": mc["survival_probability"],
        },
        "warnings": [],
        "recommendations": []
    }