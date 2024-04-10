from pydantic import BaseModel, RootModel
from typing import Optional, List, Dict
from datetime import datetime as dt

class Lifelog(BaseModel):
    id: str = None
    event: str
    start_datetime: dt = None
    end_datetime: dt = None
    updated_at: Optional[dt] = None
    updated_by: Optional[str] = None
    created_at: dt = None
    created_by_id: str

class LogColor(BaseModel):
    id: int = None
    event: str
    color_name: str = None
    color_code: str = None
    created_by_id: str

class Lifelog_res(BaseModel):
    lifelog: Optional[Lifelog]
    logColor: Optional[LogColor]

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
    root: Dict[str, Put_Lifelog_Req_Unit]

class Delete_Lifelog_Req(BaseModel):
    record_ids: List[str]