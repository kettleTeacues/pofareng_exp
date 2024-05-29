from fastapi import APIRouter, Query
from typing import List

from db.dashboard import selectDashboards, createDashboard, updateDashboard, deleteDashboard
from models.dashboard import Dashboard

router = APIRouter()

@router.get('/dashboard', tags=['dashboard'])
def getDashboards() -> List[Dashboard.Get_Response]:
    return selectDashboards()
