from sqlalchemy.orm import Session
from app.db.models import Account
import random


def generate_account_number():
    return str(random.randint(10**11, 10**12 - 1))


def create_account_for_user(db: Session, user_id: int):

    account = Account(
        user_id=user_id,
        account_number=generate_account_number(),
        account_type="savings",
        balance=0
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return account

def get_account_by_user_id(db: Session, user_id: int):
    return db.query(Account).filter(Account.user_id == user_id).first()