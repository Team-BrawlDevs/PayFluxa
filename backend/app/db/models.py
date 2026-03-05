from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, TIMESTAMP, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, index=True, nullable=False)

    phone_number = Column(String(15), unique=True, nullable=True)

    hashed_password = Column(String, nullable=False)

    role = Column(String, nullable=False)  # customer | credit_officer | risk_admin

    is_active = Column(Boolean, default=True)

    phone_verified = Column(Boolean, default=False)

    failed_login_attempts = Column(Integer, default=0)

    account_locked_until = Column(DateTime(timezone=True), nullable=True)

    password_changed_at = Column(DateTime(timezone=True), server_default=func.now())

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

class LoanRestructuringCase(Base):
    __tablename__ = "loan_restructuring_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(50), unique=True, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    loan_id = Column(Integer, ForeignKey("loans.id"), nullable=False)

    # Current Snapshot
    current_emi = Column(Numeric(12, 2), nullable=False)
    current_tenure_months = Column(Integer, nullable=False)
    current_risk_level = Column(String(20))

    # Recommended Proposal
    recommended_emi = Column(Numeric(12, 2))
    recommended_tenure_months = Column(Integer)
    recommended_risk_level = Column(String(20))

    # Simulation Metrics
    stress_probability_before = Column(Numeric(6, 2))
    stress_probability_after = Column(Numeric(6, 2))

    resilience_score_before = Column(Numeric(6, 2))
    resilience_score_after = Column(Numeric(6, 2))

    buffer_before = Column(Numeric(6, 2))
    buffer_after = Column(Numeric(6, 2))

    additional_interest_cost = Column(Numeric(12, 2))

    # Workflow
    status = Column(String(20), default="GENERATED")

    admin_comments = Column(Text)
    reviewed_by = Column(Integer, ForeignKey("users.id"))
    reviewed_at = Column(TIMESTAMP)

    generated_at = Column(TIMESTAMP, server_default=func.now())

class OTPCode(Base):
    __tablename__ = "otp_codes"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    otp_hash = Column(String, nullable=False)

    expires_at = Column(DateTime(timezone=True), nullable=False)

    is_used = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")