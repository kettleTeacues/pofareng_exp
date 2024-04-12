from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from starlette.responses import RedirectResponse
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Union

from db.users import selectUser
from models import User

load_dotenv()
SECRET_KEY = os.getenv('JWT_SECRET_KEY')
ALGORITHM = os.getenv('JWT_ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

router = APIRouter(tags=['auth'])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 大まかな流れ
# 
# ①ログインエンドポイントにPOSTリクエスト
# login(form_data: OAuth2PasswordRequestForm = Depends()) -> Token
#
#     ②DBからユーザーを取得してパスワードを検証する。
#     auth_user(fake_db, username: str, password: str):
#         get_user(fake_db, username): ②-1 | DBからユーザーを取得
#         verify_password(password, user.hashed_password): ②-2 | パスワードを検証
# 
#     ③パスワードの検証に成功したとき、アクセストークンを生成して返却する。
#     create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
# = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
# ①クレデンシャルが必要なエンドポイントにリクエスト
# |
# |       ②アクセストークンを検証してユーザーを取得する。
# |       get_current_user(token: str = Depends(oauth2_scheme)) -> User:
# |
# |   ③ユーザーが有効かどうかを確認する。
# |   get_current_active_user(current_user: User = Depends(get_current_user)) -> Union[User, None]:
# |
# ④エンドポイントの内容を返却
# read_me(current_user: User = Depends(get_current_active_user)) -> User:

# 最終的にリクエスト元に返却するモデル
class Token(BaseModel):
    access_token: str
    token_type: str

# jwt検証後に中身を取り出すモデル
class TokenData(BaseModel):
    email: Union[str, None] = None

# pydanticのユーザーモデル
class LoginUser(BaseModel):
    email: str
    is_admin: bool
    is_active: bool
    user_id: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def auth_user(email: str, password: str):
    user: User = selectUser(email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    # ユーザーを取得
    user: User = auth_user(form_data.username, form_data.password)

    # ユーザーが存在しない場合はエラーを返す
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> LoginUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = selectUser(token_data.email)
    if user is None:
        raise credentials_exception
    
    user_dict = user.to_dict()
    login_User = LoginUser(**user_dict)
    return login_User

async def get_current_active_user(login_user: LoginUser = Depends(get_current_user)) -> Union[LoginUser, None]:
    if not login_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return login_user

@router.get("/me")
async def read_me(login_user: LoginUser = Depends(get_current_active_user)) -> LoginUser:
    return login_user

@router.get("/logout")
async def logout():
    res = RedirectResponse(url="/")
    res.delete_cookie("Authorization")
    return res