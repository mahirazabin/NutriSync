import os
from dotenv import load_dotenv
import psycopg2
from urllib.parse import urlparse

load_dotenv()

print("DB URL:", os.getenv('DATABASE_URL'))  # Debug line

try:
    result = urlparse(os.getenv('DATABASE_URL'))

    conn = psycopg2.connect(
        dbname=result.path[1:],
        user=result.username,
        password=result.password,
        host=result.hostname,
        port=result.port
    )

    print("Connected to the database successfully!")

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM admin;")
    print(cursor.fetchone())

    cursor.close()
    conn.close()

except Exception as e:
    print(f"Error: {e}")
