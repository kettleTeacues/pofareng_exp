from fastapi import APIRouter, Query
from typing import List

from db import dashboard
from models.dashboard import Dashboard
from output_log import Base_Logger

router = APIRouter()
logger = Base_Logger(__name__)

@router.get('/dashboard', tags=['dashboard']) 
def get_dashboards() -> List[Dashboard.Get_Response]:
    res = dashboard.select_dashboards()
    logger.info(res)
    return res

@router.post('/dashboard', tags=['dashboard'])
def post_dashboard(req: List[Dashboard.Post_Request]) -> List[Dashboard.Get_Response]:
    res = dashboard.create_dashboard(req)
    logger.info(res)
    return res

@router.put('/dashboard', tags=['dashboard'])
def put_dashboard(req: List[Dashboard.Put_Request]) -> List[Dashboard.Get_Response]:
    res = dashboard.update_dashboard(req)
    logger.info(res)
    return res

@router.post('/dashboard', tags=['dashboard'])
def delete_dashboard(req: List[str] = Query(...)):
    res = delete_dashboard(req)
    logger.info(res)
    return res
