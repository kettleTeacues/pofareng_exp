from pydantic import BaseModel
from datetime import datetime as dt

class User(BaseModel):
    email: str
    password: str
    is_admin: bool = False
    is_active: bool = False
    last_login: dt = None
    user_id: str = None