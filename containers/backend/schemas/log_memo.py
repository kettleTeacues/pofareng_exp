from pydantic import BaseModel

from datetime import datetime as dt

class LogMemo(BaseModel):
    id: int = None
    memo: str
    log_id: int
    created_by_id: str
    created_at: dt = None
    updated_at: dt = None