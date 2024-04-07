from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, ForeignKey, UniqueConstraint
from datetime import datetime as dt
from pytz import timezone

from . import Base

class Lifelog(Base):
    __tablename__ = 'lifelog'
    id: Mapped[str] = mapped_column(Integer, primary_key=True)
    event: Mapped[str] = mapped_column(String(100))
    start_datetime: Mapped[dt] = mapped_column(DateTime(timezone=True))
    end_datetime: Mapped[dt] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[dt] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[dt] = mapped_column(DateTime(timezone=True))
    created_by_id: Mapped[str] = mapped_column(String(10), ForeignKey('user.user_id'), nullable=False)

    def __init__(self, event, start_datetime, end_datetime, created_by_id):
        self.event = event
        self.start_datetime = timezone('Asia/Tokyo').localize(start_datetime)
        self.end_datetime = timezone('Asia/Tokyo').localize(end_datetime)
        self.created_at = dt.now(tz=timezone('Asia/Tokyo'))
        self.updated_at = dt.now(tz=timezone('Asia/Tokyo'))
        self.created_by_id = created_by_id

    def __repr__(self):
        return f'<Lifelog {self.event}>'

    def to_dict(self):
        return {
            'id': self.id,
            'event': self.event,
            'start_datetime': self.start_datetime.astimezone(timezone('Asia/Tokyo')),
            'end_datetime': self.end_datetime.astimezone(timezone('Asia/Tokyo')),
            'created_at': self.created_at.astimezone(timezone('Asia/Tokyo')),
            'updated_at': self.updated_at.astimezone(timezone('Asia/Tokyo')),
            'created_by_id': self.created_by_id,
        }
    
class Log_Color(Base):
    __tablename__ = 'log_color'
    id: Mapped[str] = mapped_column(Integer, primary_key=True)
    event: Mapped[str] = mapped_column(String(100), nullable=False)
    color_name: Mapped[str] = mapped_column(String(7))
    color_code: Mapped[str] = mapped_column(String(30))
    created_by_id: Mapped[str] = mapped_column(String(10), ForeignKey('user.user_id'), nullable=False)
    
    __table_args__ = (UniqueConstraint('created_by_id', 'event', name='uix_1'), )

    def __init__(self, color_name, color_code, created_by_id):
        self.color_name = color_name
        self.color_code = color_code
        self.created_by_id = created_by_id

    def __repr__(self):
        return f'<LogColor {self.event}_{self.color_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'event': self.event,
            'color_name': self.color_name,
            'color_code': self.color_code,
            'created_by_id': self.created_by_id
        }