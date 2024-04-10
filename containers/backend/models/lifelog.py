from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, ForeignKey, UniqueConstraint
from datetime import datetime as dt

from . import Base

class Lifelog(Base):
    __tablename__ = 'lifelog'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    event: Mapped[str] = mapped_column(String(100), nullable=False)
    start_datetime: Mapped[dt] = mapped_column(DateTime(timezone=True), nullable=False)
    end_datetime: Mapped[dt] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_by_id: Mapped[str] = mapped_column(String(10), ForeignKey('user.user_id'), nullable=True)
    updated_at: Mapped[dt] = mapped_column(DateTime(timezone=True), nullable=True)
    created_by_id: Mapped[str] = mapped_column(String(10), ForeignKey('user.user_id'), nullable=False)
    created_at: Mapped[dt] = mapped_column(DateTime(timezone=True), nullable=False)

    def __init__(self, event, start_datetime, end_datetime, created_by_id):
        self.id = self.generate_uuid()
        self.event = event
        self.start_datetime = start_datetime if start_datetime.tzinfo else self.add_tz_info(start_datetime)
        self.end_datetime = end_datetime if end_datetime.tzinfo else self.add_tz_info(end_datetime)
        self.created_by_id = created_by_id
        self.created_at = self.get_current_time()

    def __repr__(self):
        return f'<Lifelog {self.event}>'

    def to_dict(self):
        return {
            'id': self.id,
            'event': self.event,
            'start_datetime': self.localize_datetime(self.start_datetime),
            'end_datetime': self.localize_datetime(self.end_datetime),
            'updated_by_id': self.updated_by_id,
            'updated_at': self.localize_datetime(self.updated_at) if self.updated_at else None,
            'created_by_id': self.created_by_id,
            'created_at': self.localize_datetime(self.created_at),
        }
    
class Log_Color(Base):
    __tablename__ = 'log_color'
    id: Mapped[str] = mapped_column(Integer, primary_key=True, autoincrement=True)
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