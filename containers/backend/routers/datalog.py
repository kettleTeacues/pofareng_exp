from fastapi import APIRouter, Query
from typing import List

from app.containers.backend.db.datalog import selectDataLogs, createDataLogs, updateDataLogs, deleteDataLogs, createLogColor, updateLogColor, deleteLogColor
from app.containers.backend.models.datalog import Datalog, Log_Color, Datalog_Log_Color

router = APIRouter()

@router.get("/lifelog", tags=["lifelog"])
def get_lifelog(
        event: List[str] = Query(None),
        sta: str = Query(None, min_length=8, max_length=8),
        end: str = Query(None, min_length=8, max_length=8),
    ) -> List[Datalog_Log_Color]:
    res = selectDataLogs(event, sta, end)
    return res

@router.post("/lifelog", tags=["lifelog"])
def post_lifelog(req: List[Datalog.Post_Request]) -> List[Datalog.Get_Response]:
    res = createDataLogs(req)
    return res

@router.put("/lifelog", tags=["lifelog"])
def put_lifelog(req: List[Datalog.Put_Request]) -> List[Datalog.Get_Response]:
    res = updateDataLogs(req)
    return res

@router.post("/lifelog/delete", tags=["lifelog"])
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
