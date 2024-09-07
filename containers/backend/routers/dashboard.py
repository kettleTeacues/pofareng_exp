from fastapi import APIRouter, Query
from typing import List

from db import dashboard
from models.dashboard import Dashboard

router = APIRouter()

@router.get('/dashboard', tags=['dashboard']) 
def get_dashboards() -> List[Dashboard.Get_Response]:
    return dashboard.select_dashboards()

@router.post('/dashboard', tags=['dashboard'])
def post_dashboard(req: List[Dashboard.Post_Request]) -> List[Dashboard.Get_Response]:
    return dashboard.create_dashboard(req)

@router.put('/dashboard', tags=['dashboard'])
def put_dashboard(req: List[Dashboard.Put_Request]) -> List[Dashboard.Get_Response]:
    return dashboard.update_dashboard(req)

@router.post('/dashboard', tags=['dashboard'])
def delete_dashboard(req: List[str] = Query(...)):
    return delete_dashboard(req)
