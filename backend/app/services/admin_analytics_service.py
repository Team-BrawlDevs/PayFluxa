from sqlalchemy.orm import Session
from app.db.models import User, Account
from app.services.health_service import calculate_health_score
from app.services.risk_service import calculate_risk_profile


def get_portfolio_overview(db: Session):

    users = db.query(User).all()
    accounts = db.query(Account).all()

    total_users = len(users)
    total_accounts = len(accounts)
    total_balance = sum([acc.balance for acc in accounts]) if accounts else 0

    health_scores = []
    risk_distribution = {"LOW": 0, "MEDIUM": 0, "HIGH": 0}
    high_risk_users = []

    for user in users:

        try:
            # Skip users without accounts automatically
            user_accounts = db.query(Account).filter(Account.user_id == user.id).all()
            if not user_accounts:
                continue

            health = calculate_health_score(db, user.id)
            risk = calculate_risk_profile(db, user.id)

            health_scores.append(health["health_score"])

            if risk["risk_level"] in risk_distribution:
                risk_distribution[risk["risk_level"]] += 1

            if risk["risk_level"] == "HIGH":
                high_risk_users.append({
                    "user_id": user.id,
                    "risk_score": risk["risk_score"]
                })

        except Exception:
            # Never let admin dashboard crash
            continue

    avg_health_score = round(
        sum(health_scores) / len(health_scores), 2
    ) if health_scores else 0

    return {
        "total_users": total_users,
        "total_accounts": total_accounts,
        "total_system_balance": float(total_balance),
        "average_health_score": avg_health_score,
        "risk_distribution": risk_distribution,
        "high_risk_users": high_risk_users
    }