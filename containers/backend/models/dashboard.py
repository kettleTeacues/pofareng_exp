from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, JSON, ForeignKey
from pydantic import BaseModel
from typing import Optional, List, Dict

from . import Base

class Dashboard(Base):
    __tablename__ = 'dashboard'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    order: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(256), nullable=True)
    json_data: Mapped[Dict] = mapped_column(JSON, nullable=True)
    updated_by_id: Mapped[str] = mapped_column(String(10), ForeignKey('user.user_id'), nullable=True)
    created_by_id: Mapped[str] = mapped_column(String(10), ForeignKey('user.user_id'), nullable=False)

    def __init__(self, title, description, json_data, created_by_id):
        self.id = self.generate_uuid()
        self.order = 0
        self.title = title
        self.description = description
        self.json_data = json_data
        self.created_by_id = created_by_id

    def __repr__(self):
        return f'<Dashboard {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'order': self.order,
            'title': self.title,
            'description': self.description,
            'json_data': self.json_data,
            'updated_by_id': self.updated_by_id,
            'created_by_id': self.created_by_id,
        }
    
    class Get_Response(BaseModel):
        id: str = None
        order: int
        title: str
        description: str = None
        json_data: List[Dict] = None
        updated_by: Optional[str] = None
        created_by_id: str

    class Post_Request(BaseModel):
        order: int
        title: str
        description: str
        json_data: Dict
        user_id: str

    class Put_Request(BaseModel):
        id: str
        order: Optional[int] = None
        title: Optional[str] = None
        description: Optional[str] = None
        json_data: Optional[List[Dict]] = None
        user_id: Optional[str] = None

    class Delete_Request(BaseModel):
        record_ids: List[str]
