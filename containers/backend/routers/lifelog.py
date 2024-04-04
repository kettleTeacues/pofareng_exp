from fastapi import APIRouter, Query
from typing import Optional, Union, List

from db.lifelog import getLifeLogs, postLifeLog, putLifeLog, deleteLifeLog, postLogColor, putLogColor, deleteLogColor
from schemas.starter import Lifelog, LogColor, Lifelog_response

router = APIRouter()

@router.get("/lifelog", tags=["lifelog"])
def get_lifelog(
        event: str = Query(None),
        sta: str = Query(None, min_length=8, max_length=8),
        end: str = Query(None, min_length=8, max_length=8),
    ) -> List[Lifelog_response]:
    res = getLifeLogs(event, sta, end)
    return res

@router.post("/lifelog", tags=["lifelog"])
def post_lifelog(lifelog: Lifelog) -> Lifelog:
    res = postLifeLog(lifelog)
    return res

@router.put("/lifelog", tags=["lifelog"])
def put_lifelog(lifelog: Lifelog) -> Lifelog:
    res = putLifeLog()
    return res

@router.delete("/lifelog", tags=["lifelog"])
def delete_lifelog(lifelog_id: int):
    res = deleteLifeLog(lifelog_id)
    return res

@router.post("/logcolor", tags=["log_color"])
def post_logcolor() -> LogColor:
    res = postLogColor()
    return res

@router.put("/logcolor", tags=["log_color"])
def put_logcolor() -> LogColor:
    res = putLogColor()
    return res

@router.delete("/logcolor", tags=["log_color"])
def delete_logcolor():
    res = deleteLogColor()
    return res