from fastapi import APIRouter, Query
from typing import Optional, Union

from db.lifelog import getLifeLogs, postLifeLog, putLifeLog, deleteLifeLog, postLogColor, putLogColor, deleteLogColor
from schemas.starter import Lifelog, LogColor

router = APIRouter()

@router.get("/lifelogs", tags=["lifelog"])
def get_lifelogs():
    res = getLifeLogs()
    return res

@router.get("/lifelog/{id}", tags=["lifelog"])
def get_lifelog_path(id: int):
    res = getLifeLogs(id)
    return res

@router.get("/lifelog", tags=["lifelog"])
def get_lifelog_query(id: int = Query(None)):
    res = getLifeLogs(id)
    return res

@router.post("/lifelog", tags=["lifelog"])
def post_lifelog(lifelog: Lifelog):
    res = postLifeLog(lifelog)
    return res

@router.put("/lifelog", tags=["lifelog"])
def put_lifelog(lifelog: Lifelog):
    res = putLifeLog()
    return res

@router.delete("/lifelog", tags=["lifelog"])
def delete_lifelog(lifelog_id: int):
    res = deleteLifeLog(lifelog_id)
    return res

@router.post("/logcolor", tags=["log_color"])
def post_logcolor():
    res = postLogColor()
    return res

@router.put("/logcolor", tags=["log_color"])
def put_logcolor():
    res = putLogColor()
    return res

@router.delete("/logcolor", tags=["log_color"])
def delete_logcolor():
    res = deleteLogColor()
    return res