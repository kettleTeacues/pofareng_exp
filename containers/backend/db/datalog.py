from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy import select, or_
from datetime import datetime as dt
from pytz import timezone
from typing import List

from . import engine
from models.datalog import Datalog, Log_Color, Dataset, Mid_Dataset_Datalog

# Datalogs
def select_dataLogs(dataset: str = None, event: List[str] = None, start_datetime: str = None, end_datetime: str = None):
    with Session(engine) as session:
        dataset_stmt = select(Dataset).filter(or_(Dataset.name == dataset, Dataset.id == dataset))
        datalog_stmt = select(
            Datalog, Log_Color
        ).outerjoin(
            Mid_Dataset_Datalog, Mid_Dataset_Datalog.datalog_id == Datalog.id
        ).outerjoin(
            Dataset, Mid_Dataset_Datalog.dataset_id == Dataset.id
        ).outerjoin(
            Log_Color, Log_Color.event == Datalog.event
        ).order_by(
            Datalog.end_datetime.desc()
        )

        if dataset:
            datalog_stmt = datalog_stmt.filter(or_(Dataset.name == dataset, Dataset.id == dataset))

        if event:
            datalog_stmt = datalog_stmt.filter(Datalog.event.in_(event))

        if start_datetime:
            # 8桁の日付文字列をdatetime型に変換
            start_datetime = dt.strptime(start_datetime, '%Y%m%d').astimezone(timezone('Asia/Tokyo'))
            datalog_stmt = datalog_stmt.filter(Datalog.end_datetime >= start_datetime)

        if end_datetime:
            # 8桁の日付文字列をdatetime型に変換
            end_datetime = dt.strptime(end_datetime, '%Y%m%d').astimezone(timezone('Asia/Tokyo'))
            datalog_stmt = datalog_stmt.filter(Datalog.start_datetime <= end_datetime)

        datalog_res = session.execute(datalog_stmt).all()
        dataset_res = session.execute(dataset_stmt).first()
        # テーブルを結合しているためタプル内に各テーブルのデータが格納されている
        # 扱いやすさを考慮してjson_resに変換する
        json_res = []
        for row in datalog_res:
            json_res.append({
                'datalog': row.tuple()[0].to_dict() if row[0] else None,
                'logColor': row.tuple()[1].to_dict() if row[1] else None
            })
        return {
            'dataset': dataset_res[0].to_dict() if dataset_res else '',
            'records': json_res
        }
    
def create_dataLogs(req: List[Datalog.Post_Request]):
    with Session(engine) as session:
        postDatalogs = []
        for params in req:
            postDatalogs.append(Datalog(
                event = params.event,
                start_datetime = params.start_datetime,
                end_datetime = params.end_datetime,
                created_by_id = params.user_id,
            ))

        session.add_all(postDatalogs)
        session.commit()
        for rec in postDatalogs:
            session.refresh(rec)
        return [rec.to_dict() for rec in postDatalogs]
    
def update_dataLogs(req: List[Datalog.Put_Request]):
    with Session(engine) as session:
        param_record_ids = [params.id for params in req]
        existing_datalogs = session.query(Datalog).filter(Datalog.id.in_(param_record_ids)).all()

        # 既存のレコードをexisting_recordとしてループ
        for existing_record in existing_datalogs:

            # 既存レコードのidがリクエストに含まれている場合、リクエストの値で更新
            if existing_record.id in param_record_ids:
                # reqからparams.id == existing_record.idのレコードを取得
                # jsのarray.filter()と同じ処理
                params = [params for params in req if params.id == existing_record.id][0]
                if params.event:
                    existing_record.event = params.event
                if params.start_datetime:
                    existing_record.start_datetime = params.start_datetime if params.start_datetime.tzinfo else timezone('Asia/Tokyo').localize(params.start_datetime)
                if params.end_datetime:
                    existing_record.end_datetime = params.end_datetime if params.end_datetime.tzinfo else timezone('Asia/Tokyo').localize(params.end_datetime)
                if params.additional:
                    existing_record.additional = params.additional

                existing_record.updated_at = dt.now(tz=timezone('Asia/Tokyo'))

        session.commit()
        return [rec.to_dict() for rec in existing_datalogs]
    
def delete_dataLogs(record_ids: List[int]):
    with Session(engine) as session:
        res = session.query(Datalog).filter(Datalog.id.in_(record_ids)).delete(synchronize_session=False)
        session.commit()
        return res
    
# Log_Colors
def create_log_color(log_color: Log_Color):
    with Session(engine) as session:
        session.add(log_color)
        session.commit()
        session.refresh(log_color)
        return log_color
        
def update_log_color(log_color: Log_Color):
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
    
def delete_log_color(log_color_id: int):
    with Session(engine) as session:
        try:
            # データベースに対象のレコードが存在するか確認
            existing_log_color = session.query(Log_Color).filter(Log_Color.id == log_color_id).one()
        except NoResultFound:
            raise ValueError(f"No existing log_color with id {log_color_id}")

        session.delete(existing_log_color)
        session.commit()
        return existing_log_color

def select_datasets():
    with Session(engine) as session:
        stmt = select(Dataset)
        res = session.execute(stmt).all()

        return [row.tuple()[0].to_dict() for row in res]

def select_dataset(id: str):
    with Session(engine) as session:
        stmt = select(Dataset).filter(Dataset.id == id)
        res = session.execute(stmt).first().tuple()[0]

        return res.to_dict()

def create_dataset(req: Dataset.Post_Request):
    with Session(engine) as session:
        dataset = Dataset(
            name=req.name,
            description=req.description,
            additional=req.additional,
            created_by_id=req.user_id,
        )
        session.add(dataset)
        session.commit()

        return dataset.to_dict()

def update_dataset(id: str, req: Dataset.Put_Request):
    with Session(engine) as session:
        stmt = select(Dataset).filter(Dataset.id == id)

        exsisting_dataset = session.execute(stmt).first().tuple()[0]

        if req.name:
            exsisting_dataset.name = req.name
        if req.description:
            exsisting_dataset.description = req.description
        if req.additional:
            exsisting_dataset.additional = req.additional

        session.commit()
        return exsisting_dataset.to_dict()

def delete_dataset(id: str):
    with Session(engine) as session:
        stmt = select(Dataset).filter(Dataset.id == id)
        existing_dataset = session.execute(stmt).first().tuple()[0]

        session.delete(existing_dataset)
        session.commit()
        return id
