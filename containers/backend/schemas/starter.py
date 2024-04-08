from pydantic import BaseModel
from datetime import datetime as dt

class Hello(BaseModel):
    id: int = None
    message: str
    created_at: dt = None
    timezone: str = 'Asia/Tokyo'