from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError

from app.config import JWT_SECRET, JWT_ALGORITHM
from app.db.database import SessionLocal
from app.db.models import User


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    print("DECODE SECRET:", JWT_SECRET)
    print("AUTH HEADER RECEIVED:", authorization)
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = int(payload.get("sub"))

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")

    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # 🔎 Verify user exists
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")

    return {
        "user_id": user.id,
        "role": user.role
    }


def require_role(required_role: str):
    def role_checker(user=Depends(get_current_user)):
        if user["role"] != required_role:
            raise HTTPException(status_code=403, detail="Forbidden: insufficient role")
        return user
    return role_checker