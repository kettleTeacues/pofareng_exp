from fastapi import APIRouter

from db.query import getHello

router = APIRouter()

@router.get("/hello")
def hello():
    res = getHello()
    return res