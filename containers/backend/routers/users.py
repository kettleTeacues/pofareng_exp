from fastapi import APIRouter
from typing import List

from db import users
from models import User, Group

router = APIRouter()

@router.get("/users", tags=["user"])
def get_user_list() -> List[User.Get_Response]:
    res = users.selectUsers()
    return res

@router.post("/user", tags=["user"])
def post_user(req: User.Post_Request) -> User.Get_Response:
    res = users.createUser(req)
    return res

@router.put("/user", tags=["user"])
def put_user(req: User.Put_Request) -> User.Get_Response:
    res = users.updateUser(req)
    return res

@router.get("/user/groups", tags=["user"])
def get_users_from_group(group_id: str):
    res = users.selectUsersFromGroup(group_id)
    return res

@router.get("/group", tags=["user"])
def get_group_from_user(user_id: str):
    res = users.selectGroupsFromUser(user_id)
    return res

@router.post("/group", tags=["user"])
def post_group(username: str, user_id: str):
    res = users.createGroup(username, user_id)
    return res

@router.post("/group/add", tags=["user"])
def add_user_to_group(user_id: str, group_id: str):
    res = users.addUserToGroup(user_id, group_id)
    return res

@router.post("/group/remove", tags=["user"])
def remove_user_to_group(user_id: str, group_id: str):
    res = users.removeUserFromGroup(user_id, group_id)
    return res