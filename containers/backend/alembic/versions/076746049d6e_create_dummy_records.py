"""create dummy records

Revision ID: 076746049d6e
Revises: bd2e74fcfe6e
Create Date: 2024-04-10 08:07:33.900084

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from dummy.dummy_records import dummy_records

# revision identifiers, used by Alembic.
revision: str = '076746049d6e'
down_revision: Union[str, None] = 'bd2e74fcfe6e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    tables = dummy_records.keys()

    for table in tables:
        for row in dummy_records[table]:
            op.execute(f"""
                INSERT INTO "{table}" ({', '.join(row.keys())})
                VALUES ({', '.join([f"'{v}'" for v in row.values()])})
            """)

def downgrade() -> None:
    tables = [key for key in dummy_records.keys()]
    tables.reverse()

    for table in tables:
        for row in dummy_records[table]:
            op.execute(f"""
                DELETE FROM "{table}"
                WHERE {' and '.join([f"{k} = '{v}'" for k, v in row.items()])}
            """)