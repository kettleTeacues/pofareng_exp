from fastapi import APIRouter, Query
from typing import Optional, Union, List
from datetime import datetime as dt

from db.lifelog import getLifeLogs, postLifeLog, putLifeLog, deleteLifeLog, postLogColor, putLogColor, deleteLogColor
from schemas.starter import Lifelog, LogColor, Lifelog_res, Post_Lifelog_Req, Put_Lifelog_Req, Delete_Lifelog_Req

router = APIRouter()

@router.get("/lifelog", tags=["lifelog"])
def get_lifelog(
        event: str = Query(None),
        sta: str = Query(None, min_length=8, max_length=8),
        end: str = Query(None, min_length=8, max_length=8),
    ) -> List[Lifelog_res]:
    res = getLifeLogs(event, sta, end)
    return res

@router.post("/lifelog", tags=["lifelog"])
def post_lifelog(req: Post_Lifelog_Req) -> Lifelog:
    res = postLifeLog(
        event = req.event,
        start_datetime = req.start_datetime,
        end_datetime = req.end_datetime,
        user_id = req.user_id,
    )
    return res

@router.put("/lifelog", tags=["lifelog"])
def put_lifelog(req: Put_Lifelog_Req) -> Lifelog:
    print(req.end_datetime)
    res = putLifeLog(
        record_id = req.record_id,
        event = req.event,
        start_datetime = req.start_datetime,
        end_datetime = req.end_datetime,
    )
    return res

@router.delete("/lifelog", tags=["lifelog"])
def delete_lifelog(req: Delete_Lifelog_Req):
    res = deleteLifeLog(req.record_id)
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