# Class for database connection and operations

import os
from dotenv import load_dotenv
import psycopg2
from urllib.parse import urlparse

def init_db():
    """
    Initialize the database connection.
    """
    load_dotenv()
    url = urlparse(os.getenv('DATABASE_URL'))
    cursor = conn.cursor()
    conn = psycopg2.connect(
        dbname=url.path[1:],
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port
    )
    return conn, cursor

def close_db(conn, cursor):
    """
    Close the database connection.
    """
    try:
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error closing database connection: {e}")