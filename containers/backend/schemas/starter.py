from pydantic import BaseModel, RootModel

from typing import Optional, Union, List, Dict
from datetime import datetime as dt

class Hello(BaseModel):
    id: int = None
    message: str
    created_at: dt = None
    timezone: str = 'Asia/Tokyo'

class User(BaseModel):
    email: str
    password: str
    is_admin: bool = False
    is_active: bool
    last_login: dt = None
    user_id: str = None

class Lifelog(BaseModel):
    id: int = None
    event: str
    start_datetime: dt = None
    end_datetime: dt = None
    created_at: dt = None
    updated_at: dt = None
    created_by_id: str

class LogColor(BaseModel):
    id: int = None
    event: str
    color_name: str = None
    color_code: str = None
    created_by_id: str

class Lifelog_res(BaseModel):
    lifelog: Union[Lifelog, None]
    logColor: Union[LogColor, None]

class Post_Lifelog_Req(BaseModel):
    event: str
    start_datetime: dt
    end_datetime: dt
    user_id: str

class Put_Lifelog_Req_Unit(BaseModel):
    event: str = None
    start_datetime: dt = None
    end_datetime: dt = None

class Put_Lifelog_Req(RootModel):
    root: Dict[int, Put_Lifelog_Req_Unit]

class Delete_Lifelog_Req(BaseModel):
    record_ids: List[int]

class LogMemo(BaseModel):
    id: int = None
    memo: str
    log_id: int
    created_by_id: str
    created_at: dt = None
    updated_at: dt = None