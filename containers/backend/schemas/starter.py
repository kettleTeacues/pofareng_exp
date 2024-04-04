from typing import Optional, Union
from datetime import datetime

from. import Base

class Hello(Base):
    id: int = None
    message: str
    created_at: datetime = None
    timezone: str = 'Asia/Tokyo'

class User(Base):
    email: str
    password: str
    is_admin: bool = False
    is_active: bool
    last_login: datetime = None
    user_id: str = None

class Lifelog(Base):
    id: int = None
    start_datetime: str = None
    end_datetime: str = None
    event: str
    created_at: str = None
    updated_at: str = None
    created_by_id: str

class LogColor(Base):
    id: int = None
    event: str
    color_name: str = None
    color_code: str = None
    created_by_id: str

class Lifelog_response(Base):
    lifelog: Union[Lifelog, None]
    logColor: Union[LogColor, None]

class LogMemo(Base):
    id: int = None
    memo: str
    log_id: int
    created_by_id: str
    created_at: datetime = None
    updated_at: datetime = None