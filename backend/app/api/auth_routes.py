from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import User
from app.core.security import hash_password, verify_password, create_access_token
from app.services.account_service import create_account_for_user
from app.services.audit_service import create_audit_log

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
def register(email: str, password: str, role: str, db: Session = Depends(get_db)):

    # Check if user exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(password)

    new_user = User(
        email=email,
        hashed_password=hashed,
        role=role
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
        action="ACCOUNT_CREATED",
        details=f"Account {account.account_number} created"
    )

    return {
        "message": "User registered successfully",
        "account_number": account.account_number
    }


# ✅ Login User
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user.id, user.role)

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role
    }