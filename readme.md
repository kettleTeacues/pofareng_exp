# 環境変数
プロジェクトルートに次の.envを配置する。

```
# backend
CORS_ALLOWED_HOSTS=host1,host2

# postgres
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB_NAME=postgres
POSTGRES_SCHEMA_NAME=public

# JWT
JWT_SECRET_KEY=JWT_SECRET_KEY
JWT_ALGORITHM=JWT_ALGORITHM

# pytest_postgres# pytest_postgre
PYTEST_POSTGRES_USERNAME=postgres
PYTEST_POSTGRES_PASSWORD=postgres
PYTEST_POSTGRES_HOST=localhost
PYTEST_POSTGRES_PORT=5432
PYTEST_POSTGRES_DB_NAME=postgres
PYTEST_POSTGRES_SCHEMA_NAME=public
```

# コマンド
- backend開発サーバー起動
\$ cd containers/backend
\$ uvicorn main:app --reload --host `host-ip-address`

- pytest
\$ cd containers/backend
\$ pytest

- alembic
\$ cd containers/backend
\$ alembic `some-commands`

- frontend開発サーバー起動
\$ cd containers/frontend
\$ yarn dev -H `host-ip-address`
