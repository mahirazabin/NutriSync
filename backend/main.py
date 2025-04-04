import os
from dotenv import load_dotenv
import psycopg2
from urllib.parse import urlparse

load_dotenv()

try:
    # Parse the URL
    result = urlparse(os.getenv('DATABASE_URL'))

    # Extract connection parameters
    conn = psycopg2.connect(
        dbname=result.path[1:],  # Remove leading '/' from path
        user=result.username,
        password=result.password,
        host=result.hostname,
        port=result.port
    )

    print("Connected to the database successfully!")

    # Create a cursor object
    cursor = conn.cursor()

    # Execute a simple query
    cursor.execute("SELECT * from Admin;")
    print(cursor.fetchone())

    # Close the connection
    cursor.close()
    conn.close()

except Exception as e:
    print(f"Error: {e}")