from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # customer | credit_officer | risk_admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    account_number = Column(String, unique=True, index=True, nullable=False)

    account_type = Column(String, nullable=False)
    # savings / current / loan

    balance = Column(Numeric(15, 2), default=0)

    currency = Column(String, default="INR")

    status = Column(String, default="active")

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    user = relationship("User")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    from_account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)

    to_account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)

    amount = Column(Numeric(15, 2), nullable=False)

    transaction_type = Column(String, nullable=False)
    # transfer / emi / deposit / withdrawal

    status = Column(String, default="pending")
    # pending / success / failed

    risk_flag = Column(String, default="low")
    # low / medium / high

    compliance_flag = Column(String, default="clear")

    reference_code = Column(String, unique=True, index=True)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"

    id = Column(Integer, primary_key=True, index=True)

    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)

    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=False)

    entry_type = Column(String, nullable=False)
    # debit / credit

    amount = Column(Numeric(15, 2), nullable=False)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    role = Column(String)
    action_type = Column(String)
    entity_type = Column(String)
    entity_id = Column(Integer, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(String)
from sqlalchemy import Column, Integer, Numeric, ForeignKey, String, DateTime
from datetime import datetime


class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    principal_amount = Column(Numeric(15, 2), nullable=False)
    interest_rate = Column(Numeric(5, 2), nullable=False)  # Annual %

    tenure_months = Column(Integer, nullable=False)

    emi_amount = Column(Numeric(15, 2), nullable=False)

    outstanding_balance = Column(Numeric(15, 2), nullable=False)

    start_date = Column(DateTime, default=datetime.utcnow)

    status = Column(String(20), default="ACTIVE")

    created_at = Column(DateTime, default=datetime.utcnow)