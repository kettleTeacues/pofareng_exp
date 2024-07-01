"""add_Dataset

Revision ID: 944e613d0115
Revises: 
Create Date: 2024-06-29 15:21:38.650548

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from dummy.dummy_records import dummy_records

# revision identifiers, used by Alembic.
revision: str = '944e613d0115'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('hello',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('message', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('timezone', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('email', sa.String(length=254), nullable=False),
    sa.Column('username', sa.String(length=100), nullable=False),
    sa.Column('password', sa.String(length=128), nullable=False),
    sa.Column('is_admin', sa.Boolean(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('user_id', sa.String(length=10), nullable=False),
    sa.PrimaryKeyConstraint('user_id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('dashboard',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('order', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.String(length=256), nullable=True),
    sa.Column('json_data', sa.JSON(), nullable=True),
    sa.Column('updated_by_id', sa.String(length=10), nullable=True),
    sa.Column('created_by_id', sa.String(length=10), nullable=False),
    sa.ForeignKeyConstraint(['created_by_id'], ['user.user_id'], ),
    sa.ForeignKeyConstraint(['updated_by_id'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('datalog',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('event', sa.String(length=100), nullable=False),
    sa.Column('start_datetime', sa.DateTime(timezone=True), nullable=False),
    sa.Column('end_datetime', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_by_id', sa.String(length=10), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_by_id', sa.String(length=10), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('additional', sa.String(), nullable=False, server_default=''),
    sa.ForeignKeyConstraint(['created_by_id'], ['user.user_id'], ),
    sa.ForeignKeyConstraint(['updated_by_id'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('dataset',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.String(length=1000), nullable=True),
    sa.Column('created_by_id', sa.String(length=10), nullable=False),
    sa.ForeignKeyConstraint(['created_by_id'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('group',
    sa.Column('group_name', sa.String(length=254), nullable=False),
    sa.Column('owner_id', sa.String(length=10), nullable=False),
    sa.Column('group_id', sa.String(length=10), nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('group_id'),
    sa.UniqueConstraint('group_name')
    )
    op.create_table('log_color',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('event', sa.String(length=100), nullable=False),
    sa.Column('color_name', sa.String(length=7), nullable=False),
    sa.Column('color_code', sa.String(length=30), nullable=False),
    sa.Column('created_by_id', sa.String(length=10), nullable=False),
    sa.ForeignKeyConstraint(['created_by_id'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('created_by_id', 'event', name='uix_1')
    )
    op.create_table('mid_group_entity',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('group_id', sa.String(length=10), nullable=False),
    sa.Column('entity_id', sa.String(length=36), nullable=False),
    sa.ForeignKeyConstraint(['group_id'], ['group.group_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('mid_group_user',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('group_id', sa.String(length=10), nullable=False),
    sa.Column('user_id', sa.String(length=10), nullable=False),
    sa.ForeignKeyConstraint(['group_id'], ['group.group_id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('log_memo',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('memo', sa.String(length=500), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_by_id', sa.String(length=10), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('created_by_id', sa.String(length=10), nullable=False),
    sa.Column('log_id', sa.String(length=36), nullable=False),
    sa.ForeignKeyConstraint(['created_by_id'], ['user.user_id'], ),
    sa.ForeignKeyConstraint(['log_id'], ['datalog.id'], ),
    sa.ForeignKeyConstraint(['updated_by_id'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('mid_dataset_datalog',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('dataset_id', sa.String(length=36), nullable=False),
    sa.Column('datalog_id', sa.String(length=36), nullable=False),
    sa.ForeignKeyConstraint(['datalog_id'], ['datalog.id'], ),
    sa.ForeignKeyConstraint(['dataset_id'], ['dataset.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
    tables = dummy_records.keys()

    for table in tables:
        for row in dummy_records[table]:
            op.execute(f"""
                INSERT INTO "{table}" ({', '.join(row.keys())})
                VALUES ({', '.join([f"'{v}'" for v in row.values()])})
            """)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('mid_dataset_datalog')
    op.drop_table('log_memo')
    op.drop_table('mid_group_user')
    op.drop_table('mid_group_entity')
    op.drop_table('log_color')
    op.drop_table('group')
    op.drop_table('dataset')
    op.drop_table('datalog')
    op.drop_table('dashboard')
    op.drop_table('user')
    op.drop_table('hello')
    # ### end Alembic commands ###
