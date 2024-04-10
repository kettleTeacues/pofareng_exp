from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, ForeignKey
from datetime import datetime as dt

from . import Base
    
class Log_Memo(Base):
    __tablename__ = 'log_memo'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    memo: Mapped[str] = mapped_column(String(500))
    updated_at: Mapped[dt] = mapped_column(DateTime(timezone=True))
    updated_by_id: Mapped[str] = mapped_column(String(10), ForeignKey('user.user_id'), nullable=False)
    created_at: Mapped[dt] = mapped_column(DateTime(timezone=True), nullable=False)
    created_by_id: Mapped[str] = mapped_column(String(10), ForeignKey('user.user_id'), nullable=False)
    log_id: Mapped[str] = mapped_column(String(36), ForeignKey('lifelog.id'), nullable=False)

    def __init__(self, memo, log_id, created_by_id):
        self.id = self.generate_uuid()
        self.memo = memo
        self.created_at = self.get_current_time()
        self.created_by_id = created_by_id
        self.log_id = log_id

    def __repr__(self):
        return f'<LogMemo {self.memo[:10]}>'

    def to_dict(self):
        return {
            'id': self.id,
            'memo': self.memo,
            'log_id': self.log_id,
            'created_at': self.localize_datetime(self.created_at),
            'created_by_id': self.created_by_id
        }