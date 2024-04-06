from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy import select
from datetime import datetime as dt
from pytz import timezone
from typing import Optional, Union, List

from db import engine
from schemas.starter import Post_Lifelog_Req
from models.starter import Lifelog, Log_Color

# Lifelogs
def getLifeLogs(event: List[str] = None, start_datetime: str = None, end_datetime: str = None):
    with Session(engine) as session:
        stmt = select(Lifelog, Log_Color).outerjoin(Log_Color, Log_Color.event == Lifelog.event)

        if event:
            stmt = stmt.filter(Lifelog.event.in_(event))

        if start_datetime:
            # 8桁の日付文字列をdatetime型に変換
            start_datetime = dt.strptime(start_datetime, '%Y%m%d').astimezone(timezone('Asia/Tokyo'))
            stmt = stmt.filter(Lifelog.end_datetime >= start_datetime)

        if end_datetime:
            # 8桁の日付文字列をdatetime型に変換
            end_datetime = dt.strptime(end_datetime, '%Y%m%d').astimezone(timezone('Asia/Tokyo'))
            stmt = stmt.filter(Lifelog.start_datetime <= end_datetime)

        res = session.execute(stmt).all()
        # テーブルを結合しているためタプル内に各テーブルのデータが格納されている
        # 扱いやすさを考慮してjson_resに変換する
        json_res = []
        for row in res:
            json_res.append({
                'lifelog': row[0].to_dict() if row[0] else None,
                'logColor': row[1].to_dict() if row[1] else None,
            })
        return json_res
    
def postLifeLog(req: List[Post_Lifelog_Req]):
    with Session(engine) as session:
        postLifelogs = []
        for params in req:
            postLifelogs.append(Lifelog(
                event = params.event,
                start_datetime = params.start_datetime,
                end_datetime = params.end_datetime,
                created_by_id = params.user_id,
            ))

        session.add_all(postLifelogs)
        session.commit()
        for rec in postLifelogs:
            session.refresh(rec)
        return [rec.to_dict() for rec in postLifelogs]
    
def putLifeLog(event: str, start_datetime: dt, end_datetime: dt, record_id: str):
    with Session(engine) as session:
        try:
            # データベースに対象のレコードが存在するか確認
            existing_lifelog = session.query(Lifelog).filter(Lifelog.id == record_id).one()
        except NoResultFound:
            raise ValueError(f"No existing lifelog with id {record_id}")

        # 既存のレコードを更新
        if event:
            existing_lifelog.event = event
        if start_datetime:
            existing_lifelog.start_datetime = timezone('Asia/Tokyo').localize(start_datetime)
        if end_datetime:
            existing_lifelog.end_datetime = timezone('Asia/Tokyo').localize(end_datetime)

        existing_lifelog.updated_at = dt.now(tz=timezone('Asia/Tokyo'))

        session.commit()
        session.refresh(existing_lifelog)
        print(existing_lifelog.to_dict()['end_datetime'])
        return existing_lifelog.to_dict()
    
def deleteLifeLog(record_ids: List[int]):
    with Session(engine) as session:
        res = session.query(Lifelog).filter(Lifelog.id.in_(record_ids)).delete(synchronize_session=False)
        session.commit()
        return res
    
# Log_Colors
def postLogColor(log_color: Log_Color):
    with Session(engine) as session:
        session.add(log_color)
        session.commit()
        session.refresh(log_color)
        return log_color
        
def putLogColor(log_color: Log_Color):
    with Session(engine) as session:
        try:
            # データベースに対象のレコードが存在するか確認
            existing_log_color = session.query(Log_Color).filter(Log_Color.id == log_color.id).one()
        except NoResultFound:
            raise ValueError(f"No existing log_color with id {log_color.id}")

        # 既存のレコードを更新
        existing_log_color.color_name = log_color.color_name
        existing_log_color.color_code = log_color.color_code

        session.commit()
        session.refresh(existing_log_color)
        return existing_log_color
    
def deleteLogColor(log_color_id: int):
    with Session(engine) as session:
        try:
            # データベースに対象のレコードが存在するか確認
            existing_log_color = session.query(Log_Color).filter(Log_Color.id == log_color_id).one()
        except NoResultFound:
            raise ValueError(f"No existing log_color with id {log_color_id}")

        session.delete(existing_log_color)
        session.commit()
        return existing_log_color