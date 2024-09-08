from fastapi import APIRouter, Query
from typing import List

from models.log_memo import Log_Memo
from output_log import Base_Logger

router = APIRouter()
logger = Base_Logger(__name__)

@router.get("/datalog/{log_id}", tags=['log_memo'])
def get_log_memo(
    log_id: int,
) -> List[Log_Memo.Get_Response]:
    res = [
        {
            "id": 1,
            "memo": """寒気ことのほか厳しく
三寒四温の候
皆様お元気で新年をお迎えのことと存じます
朝起きるのがつらい季節です
お正月気分は抜けましたか
寒中には珍しく、うららかな日が続いております
例年より寒さが身にこたえております""",
            "log_id": log_id,
            "created_by_id": "1234567890",
            "created_at": "2024-04-04T14:15:22Z",
            "updated_at": "2024-04-04T14:15:22Z"
        },
        {
            "id": 2,
            "memo": """余寒厳しき折から
暦の上ではもう春だというのに
寒さの中にも春の足音が聞こえてきます
陽射しが春めいてまいりました
梅便りが聞こえるこのごろです
花粉症には辛い季節となりました
受験シーズンも終わり、春がまた一歩近付いてまいりました""",
            "log_id": log_id,
            "created_by_id": "1234567890",
            "created_at": "2024-04-05T08:15:22Z",
            "updated_at": "2024-04-05T08:15:22Z"
        }
    ]
    logger.info(res)
    return res
