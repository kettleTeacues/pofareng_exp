from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy import select
from datetime import datetime as dt
from pytz import timezone

from db import engine
from models.log_memo import Log_Memo

# Log_Memos
def getLogMemos(user_id: str, lifelog_id: str):
    with Session(engine) as session:
        stmt = select(Log_Memo)

        if user_id:
            stmt = stmt.filter(Log_Memo.created_by_id == user_id)

        if lifelog_id:
            stmt = stmt.filter(Log_Memo.log_id == lifelog_id)

        res = session.execute(
            stmt
        ).all()

        return [row[0] for row in res]
    
def postLogMemo(log_memo: Log_Memo):
    with Session(engine) as session:
        log_memo.created_at = dt.now(tz=timezone('Asia/Tokyo'))
        
        session.add(log_memo)
        session.commit()
        session.refresh(log_memo)
        return log_memo
    
def putLogMemo(log_memo: Log_Memo):
    with Session(engine) as session:
        try:
            # データベースに対象のレコードが存在するか確認
            existing_log_memo = session.query(Log_Memo).filter(Log_Memo.id == log_memo.id).one()
        except NoResultFound:
            raise ValueError(f"No existing log_memo with id {log_memo.id}")

        # 既存のレコードを更新
        existing_log_memo.memo = log_memo.memo
        existing_log_memo.updated_at = dt.now(tz=timezone('Asia/Tokyo'))

        session.commit()
        session.refresh(existing_log_memo)
        return existing_log_memo
    
def deleteLogMemo(log_memo_id: int):
    with Session(engine) as session:
        try:
            # データベースに対象のレコードが存在するか確認
            existing_log_memo = session.query(Log_Memo).filter(Log_Memo.id == log_memo_id).one()
        except NoResultFound:
            raise ValueError(f"No existing log_memo with id {log_memo_id}")

        session.delete(existing_log_memo)
        session.commit()
        return existing_log_memo