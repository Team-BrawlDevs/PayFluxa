from app.db.models import AuditLog
from app.db.database import SessionLocal


def log_action(user_id: int, role: str, action: str, entity: str, entity_id: int = None, details: str = ""):
    print("Logging action for user:", user_id)

    db = SessionLocal()
    try:
        log = AuditLog(
            user_id=user_id,
            role=role,
            action_type=action,
            entity_type=entity,
            entity_id=entity_id,
            details=details
        )
        db.add(log)
        db.commit()
        print("Log committed")
    except Exception as e:
        print("Audit error:", e)
    finally:
        db.close()