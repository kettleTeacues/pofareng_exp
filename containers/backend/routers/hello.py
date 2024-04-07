from fastapi import APIRouter
from typing import List

from db.query import getHello
from schemas.starter import Hello

router = APIRouter()

@router.get("/hello")
def hello() -> List[Hello]:
    res = getHello()
    return res