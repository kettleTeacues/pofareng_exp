from fastapi.testclient import TestClient

from main import app
from db.users import postUser
from models import User

client = TestClient(app)
user_id = ""

def test_post_user():
    global user_id  # Declare user_id as global
    res = postUser(User(
        email="test@example.com",
        password="password",
        is_admin=True,
        is_active=True,
        last_login="2024-04-08 13:51"
    ))
    user_id = res.user_id
    assert res.email == "test@example.com"

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
    assert res.status_code == 200, res.content

def test_put_lifelog():
    data = {
        2: {
            "event": "sleep2_updated",
            "start_datetime": "2024-04-08 17:00:00",
            "end_datetime": "2024-04-08 18:00:00",
        },
        3: {
            "event": "sleep3_updated",
            "start_datetime": "2024-04-08 19:00:00+09:00",
            "end_datetime": "2024-04-08 20:00:00",
        }
    }
    res = client.put('/lifelog', json=data)
    assert res.status_code == 200, res.content

def test_delete_lifelog():
    data = {
        "record_ids": [2]
    }
    res = client.post('/lifelog/delete', json=data)
    assert res.status_code == 200, res.content

def test_get_lifelog():
    response = client.get("/lifelog")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]['lifelog']['id'] == 3 and \
           response.json()[0]['lifelog']['event'] == "sleep3_updated" and \
           response.json()[1]['lifelog']['id'] == 1 and \
           response.json()[1]['lifelog']['event'] == "sleep"