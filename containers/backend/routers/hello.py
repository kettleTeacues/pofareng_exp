from fastapi import APIRouter, Request
from typing import List

from db.query import selectHello
from models.starter import Hello
from output_log import Base_Logger

router = APIRouter()
logger = Base_Logger(__name__).logger

@router.get("/hello")
def hello(req: Request) -> List[Hello.Get_Response]:
    res = selectHello()
    logger.info(res)
    return res