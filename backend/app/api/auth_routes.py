from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import User
from app.core.security import hash_password, verify_password, create_access_token
from app.services.account_service import create_account_for_user
from app.services.audit_service import create_audit_log
from fastapi import APIRouter, Depends
from app.core.rbac import get_current_user
from app.services.otp_service import create_otp_for_user, verify_user_otp
from datetime import datetime, timedelta
from app.services.sms_service import send_sms
router = APIRouter()


# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Register User
@router.post("/register")
def register(email: str, password: str, phone_number: str, role: str, db: Session = Depends(get_db)):

    # Check if email exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if phone exists
    existing_phone = db.query(User).filter(User.phone_number == phone_number).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    # Hash password
    hashed = hash_password(password)

    # Create user
    new_user = User(
        email=email,
        phone_number=phone_number,
        hashed_password=hashed,
        role=role,
        phone_verified=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 🏦 Create bank account automatically
    account = create_account_for_user(db, new_user.id)

    # 🧾 Audit log
    create_audit_log(
    db=db,
    user_id=new_user.id,
    role=new_user.role,
    action_type="ACCOUNT_CREATED",
    entity_type="ACCOUNT",
    entity_id=account.id,
    details=f"Account {account.account_number} created"
)

    # 🔐 Generate OTP
    otp = create_otp_for_user(db, new_user.id)

    # TEMP: Print OTP (until SMS integration)
    print(f"OTP for {phone_number}: {otp}")

    return {
        "message": "User registered successfully. OTP sent for verification.",
        "account_number": account.account_number
    }


# ✅ Login User
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 🔒 Check if phone verified
    if not user.phone_verified:
        raise HTTPException(status_code=403, detail="Phone number not verified")

    # 🔒 Check if account locked
    if user.account_locked_until and datetime.utcnow() < user.account_locked_until:
        raise HTTPException(
            status_code=403,
            detail="Account locked. Try again later."
        )

    # ❌ Wrong password
    if not verify_password(password, user.hashed_password):

        user.failed_login_attempts += 1

        if user.failed_login_attempts >= 3:
            user.account_locked_until = datetime.utcnow() + timedelta(minutes=15)
            user.failed_login_attempts = 0

        db.commit()

        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ Successful password verification
    user.failed_login_attempts = 0
    user.account_locked_until = None
    db.commit()

    # 🔐 Generate OTP instead of issuing token
    otp = create_otp_for_user(db, user.id)
    message = f"Your PayFluxa login OTP is {otp}. Valid for 3 minutes."
    print(f"Login OTP for {user.phone_number}: {otp}")

    return {
        "message": "OTP sent to registered phone number"
    }
@router.post("/verify-login-otp")
def verify_login_otp(email: str, otp: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    valid = verify_user_otp(db, user.id, otp)

    if not valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    token = create_access_token(user.id, user.role)

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role
    }
    
    
@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role
    }
# ✅ Verify OTP
@router.post("/verify-otp")
def verify_otp(email: str, otp: str, db: Session = Depends(get_db)):

    # Find user
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.phone_verified:
        return {"message": "Phone already verified"}

    # Verify OTP
    from app.services.otp_service import verify_user_otp

    valid = verify_user_otp(db, user.id, otp)

    if not valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Mark phone verified
    user.phone_verified = True
    db.commit()

    return {
        "message": "Phone number verified successfully. Account activated."
    }