from fastapi import APIRouter
from typing import List

from db.query import selectHello
from models.starter import Hello

router = APIRouter()

@router.get("/hello")
def hello() -> List[Hello.Get_Response]:
    res = selectHello()
    return res