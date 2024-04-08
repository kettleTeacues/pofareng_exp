import os
from alembic import command
from alembic.config import Config
from dotenv import load_dotenv
load_dotenv()

# テスト用DBに向き先を変更
os.environ['POSTGRES_USERNAME'] = os.environ['PYTEST_POSTGRES_USERNAME']
os.environ['POSTGRES_PASSWORD'] = os.environ['PYTEST_POSTGRES_PASSWORD']
os.environ['POSTGRES_HOST'] = os.environ['PYTEST_POSTGRES_HOST']
os.environ['POSTGRES_PORT'] = os.environ['PYTEST_POSTGRES_PORT']
os.environ['POSTGRES_DB_NAME'] = os.environ['PYTEST_POSTGRES_DB_NAME']

# alembicの操作
alembic_cfg = Config("alembic.ini")
command.downgrade(alembic_cfg, "base")
command.upgrade(alembic_cfg, "head")