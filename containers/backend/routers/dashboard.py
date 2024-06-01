from fastapi import APIRouter, Query
from typing import List

from db.dashboard import selectDashboards, createDashboard, updateDashboard, deleteDashboard
from models.dashboard import Dashboard

router = APIRouter()

@router.get('/dashboard', tags=['dashboard']) 
def get_Dashboards() -> List[Dashboard.Get_Response]:
    return selectDashboards()

@router.post('/dashboard', tags=['dashboard'])
def post_Dashboard(req: List[Dashboard.Post_Request]) -> List[Dashboard.Get_Response]:
    return createDashboard(req)

@router.put('/dashboard', tags=['dashboard'])
def put_Dashboard(req: List[Dashboard.Put_Request]) -> List[Dashboard.Get_Response]:
    return updateDashboard(req)

@router.post('/dashboard', tags=['dashboard'])
def delete_Dashboard(req: List[str] = Query(...)):
    return deleteDashboard(req)
