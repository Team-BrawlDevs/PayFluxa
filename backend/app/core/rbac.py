from fastapi import Depends, HTTPException, Header
import jwt
from app.config import JWT_SECRET, JWT_ALGORITHM


# 🔐 Decode JWT
def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]  # Expecting: Bearer <token>
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# 🔐 Role Guard
def require_role(required_role: str):
    def role_checker(user=Depends(get_current_user)):
        if user["role"] != required_role:
            raise HTTPException(status_code=403, detail="Forbidden: insufficient role")
        return user
    return role_checker