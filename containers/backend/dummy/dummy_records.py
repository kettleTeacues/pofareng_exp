dummy_records = {
    "user": [
        {"email": "admin", "username": "admin", "password": "", "is_admin": True, "is_active": False, "user_id": "admin"},
        {"email": "user10@example.com", "username": "user10", "password": "", "is_admin": False, "is_active": False, "user_id": "user10_use"},
        {"email": "user20@example.com", "username": "user20", "password": "", "is_admin": False, "is_active": False, "user_id": "user20_use"},
    ],
    "group": [
        {"group_name": "admin", "owner_id": "admin", "group_id": "admin"},
        {"group_name": "public", "owner_id": "admin", "group_id": "public"},
        {"group_name": "user10", "owner_id": "user10_use", "group_id": "user10_gro"},
        {"group_name": "user20", "owner_id": "user20_use", "group_id": "user20_gro"},
    ],
    "group_user": [
        {"group_id": "admin", "user_id": "admin"},
        {"group_id": "user10_gro", "user_id": "user10_use"},
        {"group_id": "user20_gro", "user_id": "user20_use"},
    ],
    "lifelog": [
        {"id": "a00000000000000000000000000000000001", "event": "dummy1", "start_datetime": "2024-01-01 01:00:00+00", "end_datetime": "2024-01-01 11:00:00+00", "updated_by_id": "user10_use", "updated_at": "2024-01-01 01:00:00+00", "created_by_id": "user10_use", "created_at": "2024-01-01 01:00:00+00"},
        {"id": "a00000000000000000000000000000000002", "event": "dummy2", "start_datetime": "2024-02-02 02:00:00+00", "end_datetime": "2024-02-02 12:00:00+00", "updated_by_id": "user10_use", "updated_at": "2024-02-02 02:00:00+00", "created_by_id": "user10_use", "created_at": "2024-02-02 02:00:00+00"},
        {"id": "a00000000000000000000000000000000003", "event": "dummy3", "start_datetime": "2024-03-03 03:00:00+00", "end_datetime": "2024-03-03 13:00:00+00", "updated_by_id": "user10_use", "updated_at": "2024-03-03 03:00:00+00", "created_by_id": "user10_use", "created_at": "2024-03-03 03:00:00+00"},
        {"id": "a00000000000000000000000000000000004", "event": "dummy4", "start_datetime": "2024-04-04 04:00:00+00", "end_datetime": "2024-04-04 14:00:00+00", "updated_by_id": "user20_use", "updated_at": "2024-04-04 04:00:00+00", "created_by_id": "user20_use", "created_at": "2024-04-04 04:00:00+00"},
        {"id": "a00000000000000000000000000000000005", "event": "dummy5", "start_datetime": "2024-05-05 05:00:00+00", "end_datetime": "2024-05-05 15:00:00+00", "updated_by_id": "user20_use", "updated_at": "2024-05-05 05:00:00+00", "created_by_id": "user20_use", "created_at": "2024-05-05 05:00:00+00"},
        {"id": "a00000000000000000000000000000000006", "event": "dummy6", "start_datetime": "2024-06-06 06:00:00+00", "end_datetime": "2024-06-06 16:00:00+00", "updated_by_id": "user20_use", "updated_at": "2024-06-06 06:00:00+00", "created_by_id": "user20_use", "created_at": "2024-06-06 06:00:00+00"},
    ],
    "log_memo": [
        {"id": "b00000000000000000000000000000000001", "memo": "dummy_memo1", "updated_at": "2024-01-01 01:00:00+00", "updated_by_id": "user10_use", "created_by_id": "user10_use", "created_at": "2024-01-01 01:00:00+00", "log_id": "a00000000000000000000000000000000001",},
        {"id": "b00000000000000000000000000000000002", "memo": "dummy_memo2", "updated_at": "2024-02-02 02:00:00+00", "updated_by_id": "user10_use", "created_by_id": "user10_use", "created_at": "2024-02-02 02:00:00+00", "log_id": "a00000000000000000000000000000000002",},
        {"id": "b00000000000000000000000000000000003", "memo": "dummy_memo3", "updated_at": "2024-03-03 03:00:00+00", "updated_by_id": "user10_use", "created_by_id": "user10_use", "created_at": "2024-03-03 03:00:00+00", "log_id": "a00000000000000000000000000000000003",},
        {"id": "b00000000000000000000000000000000004", "memo": "dummy_memo4", "updated_at": "2024-04-04 04:00:00+00", "updated_by_id": "user20_use", "created_by_id": "user20_use", "created_at": "2024-04-04 04:00:00+00", "log_id": "a00000000000000000000000000000000004",},
        {"id": "b00000000000000000000000000000000005", "memo": "dummy_memo5", "updated_at": "2024-05-05 05:00:00+00", "updated_by_id": "user20_use", "created_by_id": "user20_use", "created_at": "2024-05-05 05:00:00+00", "log_id": "a00000000000000000000000000000000005",},
        {"id": "b00000000000000000000000000000000006", "memo": "dummy_memo6", "updated_at": "2024-06-06 06:00:00+00", "updated_by_id": "user20_use", "created_by_id": "user20_use", "created_at": "2024-06-06 06:00:00+00", "log_id": "a00000000000000000000000000000000006",},
    ],
    "group_entity": [
        {"group_id": "user10_gro", "entity_id": "a00000000000000000000000000000000001"},
        {"group_id": "user10_gro", "entity_id": "a00000000000000000000000000000000002"},
        {"group_id": "user10_gro", "entity_id": "a00000000000000000000000000000000003"},
        {"group_id": "user20_gro", "entity_id": "a00000000000000000000000000000000003"},
        {"group_id": "user10_gro", "entity_id": "a00000000000000000000000000000000004"},
        {"group_id": "user20_gro", "entity_id": "a00000000000000000000000000000000004"},
        {"group_id": "user20_gro", "entity_id": "a00000000000000000000000000000000005"},
        {"group_id": "user20_gro", "entity_id": "a00000000000000000000000000000000006"},
    ],
    "log_color": [
        {"event": "dummy1", "color_name": "red",  "color_code": "#FF0000", "created_by_id": "user10_use",},
        {"event": "dummy4", "color_name": "blue", "color_code": "#0000FF", "created_by_id": "user20_use",},
    ]
}