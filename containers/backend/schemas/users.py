from pydantic import BaseModel
from typing import Optional

class Get_User_Res(BaseModel):
    email: str
    username: str
    is_admin: bool = False
    is_active: bool = False
    user_id: str

class Post_User_Req(BaseModel):
    email: str
    username: str
    is_admin: bool = False
    is_active: bool = False
    password: str

class Put_User_Req(BaseModel):
    user_id: str
    email: Optional[str] = None
    username: Optional[str] = None
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None