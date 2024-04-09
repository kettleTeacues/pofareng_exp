from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Boolean
from datetime import datetime as dt
from pytz import timezone
from hashids import Hashids

class Base(DeclarativeBase):
    pass

# 汎用的に使うモデルはここに記述する
# 多数のテーブルから参照されるモデルなど
class User(Base):
    __tablename__ = 'user'
    email: Mapped[str] = mapped_column(String(254), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False)
    last_login: Mapped[dt] = mapped_column(DateTime(timezone=True))
    user_id: Mapped[str] = mapped_column(String(10), primary_key=True)

    def __init__(
            self,
            email,
            password,
            is_admin=False,
            is_active=False,
            last_login=dt.now().astimezone(timezone('Asia/Tokyo'))
    ):
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
            'is_active': self.is_active,
            'last_login': self.last_login,
            'user_id': self.user_id,
        }