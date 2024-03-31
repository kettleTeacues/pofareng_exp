from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime
from datetime import datetime as dt

from . import Base

class Hello(Base):
    __tablename__ = 'hello'
    id: Mapped[str] = mapped_column(Integer, primary_key=True)
    message: Mapped[str] = mapped_column(String)
    created_at: Mapped[dt] = mapped_column(DateTime(timezone=True), default=dt.now)
    timezone: Mapped[str] = mapped_column(String, default='Asia/Tokyo')

    def __init__(self, message):
        self.message = message

    def __repr__(self):
        return f'<Hello {self.message}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'created_at': self.created_at,
            'timezone': self.timezone
        }