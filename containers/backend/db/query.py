from sqlalchemy.orm import Session
from sqlalchemy import select
from pytz import timezone

from db import engine
from models.starter import Hello

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