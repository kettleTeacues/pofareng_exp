from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy import select
from datetime import datetime as dt
from pytz import timezone

from db import engine
from models.starter import Hello, User, Lifelog, Log_Color, Log_Memo
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Users
def getUsers():
    with Session(engine) as session:
        res = session.execute(
            select(User)
        ).all()

        return [row[0] for row in res]
    
def postUser(user: User):
    with Session(engine) as session:
        user.password = pwd_context.hash(user.password)

        session.add(user)
        session.commit()
        session.refresh(user)
        return user
    
def putUser(user: User):
    with Session(engine) as session:
        try:
            # データベースに対象のレコードが存在するか確認
            existing_user = session.query(User).filter(User.id == user.id).one()
        except NoResultFound:
            raise ValueError(f"No existing user with id {user.id}")
        
        user.password = pwd_context.hash(user.password)

        # 既存のレコードを更新
        existing_user.name = user.name
        existing_user.email = user.email
        existing_user.password = user.password

        session.commit()
        session.refresh(existing_user)
        return existing_user
