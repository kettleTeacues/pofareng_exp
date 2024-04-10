from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Boolean, ForeignKey
from pydantic import BaseModel
from datetime import datetime as dt
from pytz import timezone
from hashids import Hashids
from uuid import uuid4

class Base(DeclarativeBase):
    defalut_tz = 'Asia/Tokyo'

    def generate_id(self, salt: str, min_length: int):
        return Hashids(
            salt=salt,
            min_length=min_length
        ).encode(dt.now().microsecond)
    
    def generate_uuid(self):
        return str(uuid4())
    
    # タイムゾーンを指定して現在時刻を取得
    def get_current_time(self, tz_str: str = defalut_tz):
        return dt.now().astimezone(timezone(tz_str))
    
    # タイムゾーンを指定してdatetimeをローカライズ
    def localize_datetime(self, datetime: dt, tz_str: str = defalut_tz) -> dt:
        return datetime.astimezone(timezone(tz_str))
    
    # タイムゾーンを指定してdatetimeにタイムゾーン情報を付与
    def add_tz_info(self, datetime: dt, tz_str: str = defalut_tz) -> dt:
        return timezone(tz_str).localize(datetime)

# 汎用的に使うモデルはここに記述する
# 多数のテーブルから参照されるモデルなど
class User(Base):
    __tablename__ = 'user'
    email: Mapped[str] = mapped_column(String(254), nullable=False, unique=True)
    username: Mapped[str] = mapped_column(String(100), nullable=False)
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False)
    user_id: Mapped[str] = mapped_column(String(10), primary_key=True)

    def __init__(
            self,
            email,
            username,
            password,
            is_admin=False,
            is_active=False,
    ):
        self.email = email
        self.username = username
        self.password = password
        self.is_admin = is_admin
        self.is_active = is_active
        self.user_id = self.generate_id(email, 10)

    def __repr__(self):
        return f'<CustomUser {self.email}>'

    def to_dict(self):
        return {
            'email': self.email,
            'username': self.username,
            'password': self.password,
            'is_admin': self.is_admin,
            'is_active': self.is_active,
            'user_id': self.user_id,
        }
    
class Group(Base):
    __tablename__ = 'group'
    group_name: Mapped[str] = mapped_column(String(254), nullable=False, unique=True)
    owner_id: Mapped[str] = mapped_column(ForeignKey('user.user_id'), nullable=False)
    group_id: Mapped[str] = mapped_column(String(10), primary_key=True)

    def __init__(self, group_name, owner_id):
        self.group_name = group_name
        self.owner_id = owner_id
        self.group_id = self.generate_id(group_name, 10)
    
    def to_dict(self):
        return {
            'group_name': self.group_name,
            'owner_id': self.owner_id,
            'group_id': self.group_id,
        }

class GroupUser(Base):
    __tablename__ = 'group_user'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    group_id: Mapped[str] = mapped_column(ForeignKey('group.group_id'), nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey('user.user_id'), nullable=False)

    def __init__(self, group_id, user_id):
        self.group_id = group_id
        self.user_id = user_id

    def to_dict(self):
        return {
            'group_id': self.group_id,
            'user_id': self.user_id,
        }
    
class GroupEntity(Base):
    __tablename__ = 'group_entity'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    group_id: Mapped[str] = mapped_column(ForeignKey('group.group_id'), nullable=False)
    entity_id: Mapped[str] = mapped_column(String(36), nullable=False)