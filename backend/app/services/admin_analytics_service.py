from sqlalchemy.orm import Session
from app.db.models import User, Account
from app.services.health_service import calculate_health_score
from app.services.risk_service import calculate_risk_profile



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
    risk_distribution = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
    high_risk_users = []

    # For stress distribution buckets
    stress_distribution = {
        "0-10%": 0,
        "10-20%": 0,
        "20-30%": 0,
        "30-40%": 0,
        "40-50%": 0,
        "50%+": 0,
    }

    total_stress_probability = 0
    counted_users = 0

    for user in users:
        try:
            user_accounts = db.query(Account).filter(Account.user_id == user.id).all()
            if not user_accounts:
                continue

            health = calculate_health_score(db, user.id)
            risk = calculate_risk_profile(db, user.id)

            health_score = health["health_score"]
            risk_score = risk["risk_score"]
            risk_level = risk["risk_level"]
            stress_probability = risk.get("stress_probability_percentage", 0)

            health_scores.append(health_score)

            # Risk distribution
            if risk_level in risk_distribution:
                risk_distribution[risk_level] += 1

            # High risk users
            if risk_level in ["HIGH", "CRITICAL"]:
                high_risk_users.append({
                    "user_id": user.id,
                    "risk_score": risk_score
                })

            # Stress distribution buckets
            total_stress_probability += stress_probability
            counted_users += 1

            if stress_probability <= 10:
                stress_distribution["0-10%"] += 1
            elif stress_probability <= 20:
                stress_distribution["10-20%"] += 1
            elif stress_probability <= 30:
                stress_distribution["20-30%"] += 1
            elif stress_probability <= 40:
                stress_distribution["30-40%"] += 1
            elif stress_probability <= 50:
                stress_distribution["40-50%"] += 1
            else:
                stress_distribution["50%+"] += 1

        except Exception:
            continue

    avg_health_score = round(
        sum(health_scores) / len(health_scores), 2
    ) if health_scores else 0

    avg_stress_probability = round(
        total_stress_probability / counted_users, 2
    ) if counted_users else 0

    return {
        "total_users": total_users,
        "total_accounts": total_accounts,
        "total_system_balance": float(total_balance),
        "average_health_score": avg_health_score,
        "risk_distribution": risk_distribution,
        "high_risk_users": high_risk_users,
        "average_stress_probability_percentage": avg_stress_probability,
        "stress_distribution": stress_distribution,
    }