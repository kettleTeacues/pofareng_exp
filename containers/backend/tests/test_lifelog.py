from fastapi.testclient import TestClient

from main import app
from models import User

client = TestClient(app)
user_id = ""
log_ids = []

def test_post_user():
    global user_id  # Declare user_id as global
    res = client.post("/user", json={
        "email": "pytest@example.com",
        "username": "pytest_user",
        "password": "password",
        "is_admin": True,
        "is_active": True
    }).json()
    user_id = res['user_id']
    groups = client.get(f"/group?user_id={user_id}").json()
    users_in_group = client.get(f'/user/groups?group_id={groups[0]["group_id"]}').json()
    assert res['email'] == "pytest@example.com"
    assert groups[0]['group_name'] == "pytest_user"
    assert users_in_group[0]['user_id'] == user_id

def test_post_lifelog():
    data = [
        {
            "event": "sleep",
            "start_datetime": "2024-04-08T04:00:00+09:00",
            "end_datetime": "2024-04-08T06:00:00+09:00",
            "user_id": user_id
        },
        {
            "event": "sleep",
            "start_datetime": "2024-04-08 07:00:00",
            "end_datetime": "2024-04-08 08:00:00",
            "user_id": user_id
        },
        {
            "event": "sleep",
            "start_datetime": "2024-04-08 09:00:00+09:00",
            "end_datetime": "2024-04-08 10:00:00",
            "user_id": user_id
        },
    ]
    res = client.post("/lifelog", json=data)
    for rec in res.json():
        log_ids.append(rec['id'])
    assert res.status_code == 200, res.content

def test_put_lifelog():
    data = {
        log_ids[1]: {
            "event": "sleep2_updated",
            "start_datetime": "2024-04-08 17:00:00",
            "end_datetime": "2024-04-08 18:00:00",
        },
        log_ids[2]: {
            "event": "sleep3_updated",
            "start_datetime": "2024-04-08 19:00:00+09:00",
            "end_datetime": "2024-04-08 20:00:00",
        }
    }
    res = client.put('/lifelog', json=data)
    assert res.status_code == 200, res.content

def test_delete_lifelog():
    data = {
        "record_ids": [log_ids[2]]
    }
    res = client.post('/lifelog/delete', json=data)
    assert res.status_code == 200, res.content

def test_get_lifelog():
    res = client.get("/lifelog")
    assert res.status_code == 200
    assert len(res.json()) == 2
    assert res.json()[0]['lifelog']['event'] == "sleep2_updated" and \
           res.json()[1]['lifelog']['event'] == "sleep"