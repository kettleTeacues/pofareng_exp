from fastapi import APIRouter, Query
from typing import List

from db.lifelog import getLifeLogs, postLifeLog, putLifeLog, deleteLifeLog, postLogColor, putLogColor, deleteLogColor
from schemas.lifelog import Lifelog, LogColor, Lifelog_res, Post_Lifelog_Req, Put_Lifelog_Req, Delete_Lifelog_Req

router = APIRouter()

@router.get("/lifelog", tags=["lifelog"])
def get_lifelog(
        event: List[str] = Query(None),
        sta: str = Query(None, min_length=8, max_length=8),
        end: str = Query(None, min_length=8, max_length=8),
    ) -> List[Lifelog_res]:
    res = getLifeLogs(event, sta, end)
    return res

@router.post("/lifelog", tags=["lifelog"])
def post_lifelog(req: List[Post_Lifelog_Req]) -> List[Lifelog]:
    res = postLifeLog(req)
    return res

@router.put("/lifelog", tags=["lifelog"])
def put_lifelog(req: Put_Lifelog_Req) -> List[Lifelog]:
    res = putLifeLog(req.root)
    return res

@router.delete("/lifelog", tags=["lifelog"])
def delete_lifelog(req: Delete_Lifelog_Req):
    return deleteLifeLog(req.record_ids)

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