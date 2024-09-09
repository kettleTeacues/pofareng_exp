from fastapi import APIRouter, Query
from typing import List

from db import datalog
from models.datalog import Dataset, Datalog, Log_Color, Joined_Datalog
from output_log import Base_Logger

router = APIRouter()
logger = Base_Logger(__name__).logger

# dataset
@router.get('/datasets', tags=['dataset'])
def get_datasets() -> List[Dataset.Get_Response]:
    res = datalog.select_datasets()
    logger.info(res)
    return res

@router.get('/datasets/{id}', tags=['dataset'])
def get_dataset(id: str) -> Dataset.Get_Response:
    res = datalog.select_dataset(id)
    logger.info(res)
    return res

@router.post('/datasets', tags=['dataset'])
def get_dataset(req: Dataset.Post_Request) -> Dataset.Get_Response:
    res = datalog.create_dataset(req)
    logger.info(res)
    return res

@router.put('/datasets/{id}', tags=['dataset'])
def get_dataset(id: str, req: Dataset.Put_Request) -> Dataset.Get_Response:
    res = datalog.update_dataset(id, req)
    logger.info(res)
    return res

@router.delete('/datasets/{id}', tags=['dataset'])
def get_dataset(id: str) -> str:
    res = datalog.delete_dataset(id)
    logger.info(res)
    return res

# datalog
@router.get("/datalog", tags=["datalog"])
def get_lifelog(
        dataset: str = Query(None, max_length=100),
        event: List[str] = Query(None),
        sta: str = Query(None, min_length=8, max_length=8),
        end: str = Query(None, min_length=8, max_length=8),
    ) -> Joined_Datalog:
    res = datalog.select_dataLogs(dataset, event, sta, end)
    logger.info(res)
    return res

@router.post("/datalog", tags=["datalog"])
def post_lifelog(req: List[Datalog.Post_Request]) -> List[Datalog.Get_Response]:
    res = datalog.create_dataLogs(req)
    logger.info(res)
    return res

@router.put("/datalog", tags=["datalog"])
def put_lifelog(req: List[Datalog.Put_Request]) -> List[Datalog.Get_Response]:
    res = datalog.update_dataLogs(req)
    logger.info(res)
    return res

@router.post("/datalog/delete", tags=["datalog"])
def delete_lifelog(req: Datalog.Delete_Request):
    res = datalog.delete_dataLogs(req.record_ids)
    logger.info(res)
    return res

# log_color
@router.post("/logcolor", tags=["log_color"])
def post_logcolor() -> Log_Color.Get_Response:
    res = datalog.create_log_color()
    logger.info(res)
    return res

@router.put("/logcolor", tags=["log_color"])
def put_logcolor() -> Log_Color.Get_Response:
    res = datalog.update_log_color()
    logger.info(res)
    return res

@router.delete("/logcolor", tags=["log_color"])
def delete_logcolor():
    res = datalog.delete_log_color()
    logger.info(res)
    return res
