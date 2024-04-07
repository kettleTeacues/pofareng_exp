from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, ForeignKey
from datetime import datetime as dt

from . import Base
    
class Log_Memo(Base):
    __tablename__ = 'log_memo'
    id: Mapped[str] = mapped_column(Integer, primary_key=True)
    memo: Mapped[str] = mapped_column(String(500))
    log_id: Mapped[str] = mapped_column(Integer, ForeignKey('lifelog.id'), nullable=False)
    created_by_id: Mapped[str] = mapped_column(String(10), ForeignKey('user.user_id'), nullable=False)
    created_at: Mapped[dt] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[dt] = mapped_column(DateTime(timezone=True))

    def __init__(self, memo, log_id, created_by_id):
        self.memo = memo
        self.log_id = log_id
        self.created_by_id = created_by_id

    def __repr__(self):
        return f'<LogMemo {self.memo[:10]}>'

    def to_dict(self):
        return {
            'id': self.id,
            'memo': self.memo,
            'log_id': self.log_id,
            'created_by_id': self.created_by_id
        }