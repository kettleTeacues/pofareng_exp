from fastapi import APIRouter, Query
from typing import List

from db.datalog import selectDataLogs, createDataLogs, updateDataLogs, deleteDataLogs, createLogColor, updateLogColor, deleteLogColor
from models.datalog import Datalog, Log_Color, Datalog_Log_Color

router = APIRouter()

@router.get("/datalog", tags=["datalog"])
def get_lifelog(
        event: List[str] = Query(None),
        sta: str = Query(None, min_length=8, max_length=8),
        end: str = Query(None, min_length=8, max_length=8),
    ) -> List[Datalog_Log_Color]:
    res = selectDataLogs(event, sta, end)
    return res

@router.post("/datalog", tags=["datalog"])
def post_lifelog(req: List[Datalog.Post_Request]) -> List[Datalog.Get_Response]:
    res = createDataLogs(req)
    return res

@router.put("/datalog", tags=["datalog"])
def put_lifelog(req: List[Datalog.Put_Request]) -> List[Datalog.Get_Response]:
    res = updateDataLogs(req)
    return res

@router.post("/datalog/delete", tags=["datalog"])
def delete_lifelog(req: Datalog.Delete_Request):
    return deleteDataLogs(req.record_ids)

@router.post("/logcolor", tags=["log_color"])
def post_logcolor() -> Log_Color.Get_Response:
    res = createLogColor()
    return res

@router.put("/logcolor", tags=["log_color"])
def put_logcolor() -> Log_Color.Get_Response:
    res = updateLogColor()
    return res

@router.delete("/logcolor", tags=["log_color"])
def delete_logcolor():
    res = deleteLogColor()
    return res
