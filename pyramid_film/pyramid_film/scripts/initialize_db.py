import argparse
import sys
from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError
from sqlalchemy import create_engine
from .. import models  # import models yang sudah kamu buat, misalnya models.Base

def initialize_db(dbsession):
    """
    Initialize the database and create tables.
    This function will create tables based on models defined in SQLAlchemy (Base).
    """
    engine = create_engine('postgresql+psycopg2://username:password@localhost/pyramid_film')  # ganti dengan URL db yang sesuai
    models.Base.metadata.create_all(engine)  # create all tables based on models

    print("Database tables initialized successfully.")

def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    return parser.parse_args(argv[1:])

def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:  # Transaksi database
            dbsession = env['request'].dbsession
            initialize_db(dbsession)  # Panggil fungsi untuk inisialisasi database
    except OperationalError:
        print('''
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to initialize your database tables with `alembic`.
    Check your README.txt for description and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.
            ''')
