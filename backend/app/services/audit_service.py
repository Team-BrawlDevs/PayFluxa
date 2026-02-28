from sqlalchemy.orm import Session
from app.db.models import AuditLog
from datetime import datetime


def create_audit_log(
    db: Session,
    user_id: int,
    role: str,
    action_type: str,
    entity_type: str = None,
    entity_id: int = None,
    details: str = None
):

    audit = AuditLog(
        user_id=user_id,
        role=role,
        action_type=action_type,
        entity_type=entity_type,
        entity_id=entity_id,
        timestamp=datetime.utcnow(),
        details=details
    )

    db.add(audit)
    db.commit()