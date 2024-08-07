from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.orm import Session

from main import app
from db import engine
from dummy.dummy_records import dummy_records

client = TestClient(app)
user_id = ''
log_ids = []

# すべてのダミーデータを削除
with Session(engine) as session:
    tables = [key for key in dummy_records.keys()]
    tables.reverse()

    for table in tables:
        session.execute(text(f'DELETE FROM "{table}"'))
    
    session.commit()

def test_post_users():
    global user_id  # Declare user_id as global
    res = client.post('/user', json={
        'email': 'pytest@example.com',
        'username': 'pytest_user',
        'password': 'password',
        'is_admin': True,
        'is_active': True
    }).json()
    user_id = res['user_id']
    groups = client.get(f'/group?user_id={user_id}').json()
    users_in_group = client.get(f'/user/groups?group_id={groups[0]["group_id"]}').json()
    assert res['email'] == 'pytest@example.com'
    assert groups[0]['group_name'] == 'pytest_user'
    assert users_in_group[0]['user_id'] == user_id

def test_post_datalogs():
    data = [
        {
            'event': 'sleep',
            'start_datetime': '2000-04-08T04:00:00+09:00',
            'end_datetime': '2000-04-08T06:00:00+09:00',
            'user_id': user_id
        },
        {
            'event': 'sleep',
            'start_datetime': '2000-04-08 07:00:00',
            'end_datetime': '2000-04-08 08:00:00',
            'user_id': user_id
        },
        {
            'event': 'sleep',
            'start_datetime': '2000-04-08 09:00:00+09:00',
            'end_datetime': '2000-04-08 10:00:00',
            'user_id': user_id
        },
    ]
    res = client.post('/datalog', json=data)
    for rec in res.json():
        log_ids.append(rec['id'])
    assert res.status_code == 200, res.content

def test_put_datalogs():
    data = [
        {
            'id': log_ids[0],
            'event': 'sleep2_updated',
            'start_datetime': '2000-04-08 17:00:00',
            'end_datetime': '2000-04-08 18:00:00',
        },
        {
            'id': log_ids[2],
            'event': 'sleep3_updated',
            'start_datetime': '2000-04-08 19:00:00+09:00',
            'end_datetime': '2000-04-08 20:00:00',
        }
    ]
    res = client.put('/datalog', json=data)
    assert res.status_code == 200, res.content

def test_delete_datalogs():
    data = {
        'record_ids': [log_ids[2]]
    }
    res = client.post('/datalog/delete', json=data)
    assert res.status_code == 200, res.content

def test_get_datalogs():
    res = client.get('/datalog')
    assert res.status_code == 200
    assert len(res.json()) == 2
    assert res.json()['records'][0]['datalog']['event'] == 'sleep2_updated'
    assert res.json()['records'][1]['datalog']['event'] == 'sleep'
