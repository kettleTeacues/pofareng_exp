from sqlalchemy import create_engine

from urllib.parse import quote_plus
from dotenv import load_dotenv

import os
from models import Base

load_dotenv()
dialect = 'postgresql'
username = os.getenv('POSTGRES_USERNAME', 'postgres')
password = os.getenv('POSTGRES_PASSWORD', 'postgres')
host = os.getenv('POSTGRES_HOST', 'localhost')
port = os.getenv('POSTGRES_PORT', '5432')
databaseName = os.getenv('POSTGRES_DB_NAME', 'postgres')
charset = 'utf8'

password = quote_plus(password)
url = f'{dialect}://{username}:{password}@{host}:{port}/{databaseName}'
engine = create_engine(url)
Base.metadata.create_all(engine)