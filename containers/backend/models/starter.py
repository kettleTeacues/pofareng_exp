from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, ForeignKey, Boolean, ForeignKeyConstraint,  UniqueConstraint
from datetime import datetime as dt
from hashids import Hashids

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
    
class User(Base):
    __tablename__ = 'user'
    email: Mapped[str] = mapped_column(String(254), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False)
    last_login: Mapped[dt] = mapped_column(DateTime(timezone=True))
    user_id: Mapped[str] = mapped_column(String(10), primary_key=True)

    def __init__(self, email, password, is_admin, is_active, last_login=None):
        hashids = Hashids(
            salt=email,
            min_length=10
        )
        now = dt.now()

        self.email = email
        self.password = password
        self.is_admin = is_admin
        self.is_active = is_active
        self.last_login = last_login
        self.user_id = hashids.encode(now.microsecond)

    def __repr__(self):
        return f'<CustomUser {self.email}>'

    def to_dict(self):
        return {
            'email': self.email,
            'password': self.password,
            'is_admin': self.is_admin,
            'created_at': self.created_at,
            'is_active': self.is_active,
            'last_login': self.last_login,
            'user_id': self.user_id,
        }

class Lifelog(Base):
    __tablename__ = 'lifelog'
    id: Mapped[str] = mapped_column(Integer, primary_key=True)
    start_datetime: Mapped[dt] = mapped_column(DateTime(timezone=True))
    end_datetime: Mapped[dt] = mapped_column(DateTime(timezone=True))
    event: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[dt] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[dt] = mapped_column(DateTime(timezone=True))
    created_by_id: Mapped[str] = mapped_column(String(10), ForeignKey('user.user_id'), nullable=False)

    def __init__(self, event, created_by_id, start_datetime=None, end_datetime=None):
        self.event = event
        self.created_by_id = created_by_id
        self.start_datetime = start_datetime
        self.end_datetime = end_datetime

    def __repr__(self):
        return f'<Lifelog {self.record_key}>'

    def to_dict(self):
        return {
            'id': self.id,
            'start_datetime': self.start_datetime,
            'end_datetime': self.end_datetime,
            'event': self.event,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'created_by_id': self.created_by_id
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
    
class Log_Memo(Base):
    __tablename__ = 'log_memo'
    id: Mapped[str] = mapped_column(Integer, primary_key=True)
    memo: Mapped[str] = mapped_column(String(500))
    log_id: Mapped[str] = mapped_column(Integer, ForeignKey('lifelog.id'), nullable=False)
    created_by_id: Mapped[str] = mapped_column(String(10), ForeignKey('user.user_id'), nullable=False)

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