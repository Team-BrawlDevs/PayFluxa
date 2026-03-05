import bcrypt
import jwt
from datetime import datetime, timedelta
from app.config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
import secrets
import hashlib

# 🔐 Hash password
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


# 🔐 Verify password
def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


# 🔐 Create JWT token
def create_access_token(user_id: int, role: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": expire
    }
    print("ENCODE SECRET:", JWT_SECRET)
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token
# 🔐 Generate OTP
def generate_otp() -> str:
    return str(secrets.randbelow(900000) + 100000)  # 6 digit OTP


# 🔐 Hash OTP before storing in DB
def hash_otp(otp: str) -> str:
    return hashlib.sha256(otp.encode()).hexdigest()


# 🔐 Verify OTP
def verify_otp(otp: str, hashed_otp: str) -> bool:
    return hashlib.sha256(otp.encode()).hexdigest() == hashed_otp