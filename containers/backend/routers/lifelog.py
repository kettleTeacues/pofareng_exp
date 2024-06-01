from fastapi import APIRouter, Query
from typing import List

from db.lifelog import selectLifeLogs, createLifeLog, updateLifeLog, deleteLifeLog, createLogColor, updateLogColor, deleteLogColor
from models.lifelog import Lifelog, Log_Color, Lifelog_Lifelog_Color

router = APIRouter()

@router.get("/lifelog", tags=["lifelog"])
def get_lifelog(
        event: List[str] = Query(None),
        sta: str = Query(None, min_length=8, max_length=8),
        end: str = Query(None, min_length=8, max_length=8),
    ) -> List[Lifelog_Lifelog_Color]:
    res = selectLifeLogs(event, sta, end)
    return res

@router.post("/lifelog", tags=["lifelog"])
def post_lifelog(req: List[Lifelog.Post_Request]) -> List[Lifelog.Get_Response]:
    res = createLifeLog(req)
    return res

@router.put("/lifelog", tags=["lifelog"])
def put_lifelog(req: List[Lifelog.Put_Request]) -> List[Lifelog.Get_Response]:
    res = updateLifeLog(req)
    return res

@router.post("/lifelog/delete", tags=["lifelog"])
def delete_lifelog(req: Lifelog.Delete_Request):
    return deleteLifeLog(req.record_ids)

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
