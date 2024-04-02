from sqlalchemy.orm import Session
from sqlalchemy import select
from pytz import timezone

from db import engine
from models.starter import Hello, User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def getHello():
    with Session(engine) as session:
        res = session.execute(
            select(Hello)
        ).all()

        # 日本時間に変換して返却
        jstRows = [row[0] for row in res]
        for row in jstRows:
            row.created_at = row.created_at.astimezone(timezone(row.timezone))

        return jstRows
    
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