from typing import Optional, Union
from datetime import datetime as dt

from. import Base

class Hello(Base):
    id: int = None
    message: str
    created_at: dt = None
    timezone: str = 'Asia/Tokyo'

class User(Base):
    email: str
    password: str
    is_admin: bool = False
    is_active: bool
    last_login: dt = None
    user_id: str = None

class Lifelog(Base):
    id: int = None
    event: str
    start_datetime: dt = None
    end_datetime: dt = None
    created_at: dt = None
    updated_at: dt = None
    created_by_id: str

class LogColor(Base):
    id: int = None
    event: str
    color_name: str = None
    color_code: str = None
    created_by_id: str

class Lifelog_res(Base):
    lifelog: Union[Lifelog, None]
    logColor: Union[LogColor, None]

class Post_Lifelog_Req(Base):
    event: str
    start_datetime: dt
    end_datetime: dt
    user_id: str

class Put_Lifelog_Req(Base):
    record_id: int
    event: str = None
    start_datetime: dt = None
    end_datetime: dt = None

class Delete_Lifelog_Req(Base):
    record_id: int

class LogMemo(Base):
    id: int = None
    memo: str
    log_id: int
    created_by_id: str
    created_at: dt = None
    updated_at: dt = None