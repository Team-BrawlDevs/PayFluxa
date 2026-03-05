from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.db.models import OTPCode
from app.core.security import generate_otp, hash_otp, verify_otp


OTP_EXPIRY_MINUTES = 3


# 🔹 Generate and store OTP
def create_otp_for_user(db: Session, user_id: int):

    otp = generate_otp()
    hashed = hash_otp(otp)

    expiry = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)

    otp_entry = OTPCode(
        user_id=user_id,
        otp_hash=hashed,
        expires_at=expiry
    )

    db.add(otp_entry)
    db.commit()

    return otp


# 🔹 Verify OTP
def verify_user_otp(db: Session, user_id: int, otp: str):

    otp_record = (
        db.query(OTPCode)
        .filter(
            OTPCode.user_id == user_id,
            OTPCode.is_used == False
        )
        .order_by(OTPCode.created_at.desc())
        .first()
    )

    if not otp_record:
        return False

    # FIXED LINE
    if datetime.now(timezone.utc) > otp_record.expires_at:
        return False

    if not verify_otp(otp, otp_record.otp_hash):
        return False

    otp_record.is_used = True
    db.commit()

    return True