from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy import select
from datetime import datetime as dt
from pytz import timezone
from passlib.context import CryptContext

from . import engine
from models import User, Group, Mid_Group_User, GroupEntity

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Users
def selectUser(email: str) -> User:
    with Session(engine) as session:
        res = session.query(User).filter(User.email == email).one()
        return res

def selectUsers():
    with Session(engine) as session:
        res = session.execute(
            select(User)
        ).all()

        return [row[0] for row in res]
    
def createUser(req: User.Post_Request):
    with Session(engine) as session:
        # User追加
        user = User(
            email=req.email,
            username=req.username,
            is_admin=req.is_admin,
            is_active=req.is_active,
            password=pwd_context.hash(req.password)
        )
        session.add(user)
        session.flush([user])

        # Group追加
        group = Group(
            group_name=req.username,
            owner_id=user.user_id
        )
        session.add(group)
        session.flush([group])

        # Userを初期Groupに追加
        mid_group_user = Mid_Group_User(
            user_id=user.user_id,
            group_id=group.group_id
        )
        session.add(mid_group_user)
        session.flush([mid_group_user])

        session.commit()
        session.refresh(user)

        return user.to_dict()
    
def updateUser(req: User.Put_Request):
    with Session(engine) as session:
        try:
            # データベースに対象のレコードが存在するか確認
            existing_user = session.execute(select(User).filter(User.user_id == req.user_id)).one()[0]
        except NoResultFound:
            raise ValueError(f"No existing user with id {req.user_id}")
        
        # 既存のレコードを更新
        if req.email:
            existing_user.email = req.email
        if req.username:
            existing_user.username = req.username
        if req.is_admin is not None:
            existing_user.is_admin = req.is_admin
        if req.is_active is not None:
            existing_user.is_active = req.is_active
        if req.password:
            existing_user.password = pwd_context.hash(req.password)

        session.commit()
        session.refresh(existing_user)
        return existing_user

# Groups
def createGroup(group_name: str, owner_id: str):
    with Session(engine) as session:
        group = Group(
            group_name=group_name,
            owner_id=owner_id
        )

        session.add(group)
        session.commit()
        session.refresh(group)
        return group
    
def updateGroup(group_id: str, group_name: str, owner_id: str):
    with Session(engine) as session:
        try:
            # データベースに対象のレコードが存在するか確認
            existing_group = session.execute(select(Group).filter(Group.group_id == group_id)).one()[0]
        except NoResultFound:
            raise ValueError(f"No existing group with id {group_id}")
        
        # 既存のレコードを更新
        if group_name:
            existing_group.group_name = group_name
        if owner_id:
            existing_group.owner_id = owner_id

        session.commit()
        session.refresh(existing_group)
        return existing_group

def selectGroupsFromUser(user_id: str):
    with Session(engine) as session:
        res = session.execute(
            select(Group).join(Mid_Group_User, Group.group_id == Mid_Group_User.group_id).where(Mid_Group_User.user_id == user_id)
        ).all()

        return [row[0].to_dict() for row in res]
    
def selectUsersFromGroup(group_id: str):
    with Session(engine) as session:
        res = session.execute(
            select(User).join(Mid_Group_User, User.user_id == Mid_Group_User.user_id).where(Mid_Group_User.group_id == group_id)
        ).all()

        return [row[0].to_dict() for row in res]
    
def addUserToGroup(user_id: str, group_id: str):
    with Session(engine) as session:
        mid_group_user = Mid_Group_User(
            user_id=user_id,
            group_id=group_id
        )

        session.add(mid_group_user)
        session.commit()
        session.refresh(mid_group_user)
        return mid_group_user
    
def removeUserFromGroup(user_id: str, group_id: str):
    with Session(engine) as session:
        res = session.query(Mid_Group_User).filter(Mid_Group_User.user_id == user_id, Mid_Group_User.group_id == group_id).delete()
        session.commit()
        return res
