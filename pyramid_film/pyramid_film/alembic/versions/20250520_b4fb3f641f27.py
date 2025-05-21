"""add user_id to films and reviews

Revision ID: b4fb3f641f27
Revises: 86dc1a2e6870
Create Date: 2025-05-20 21:45:30.523195

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b4fb3f641f27'
down_revision = '86dc1a2e6870'
branch_labels = None
depends_on = None


def upgrade():
    # Tambah kolom user_id ke films
    op.add_column('films', sa.Column('user_id', sa.Integer(), nullable=False))
    op.create_foreign_key('fk_films_user_id', 'films', 'users', ['user_id'], ['id'])

    # Tambah kolom user_id ke reviews
    op.add_column('reviews', sa.Column('user_id', sa.Integer(), nullable=False))
    op.create_foreign_key('fk_reviews_user_id', 'reviews', 'users', ['user_id'], ['id'])


def downgrade():
    op.drop_constraint('fk_reviews_user_id', 'reviews', type_='foreignkey')
    op.drop_column('reviews', 'user_id')

    op.drop_constraint('fk_films_user_id', 'films', type_='foreignkey')
    op.drop_column('films', 'user_id')
