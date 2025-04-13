import os
from dotenv import load_dotenv
import psycopg2
from urllib.parse import urlparse

load_dotenv()

def get_connection():
    result = urlparse(os.getenv('DATABASE_URL'))
    return psycopg2.connect(
        dbname=result.path[1:],
        user=result.username,
        password=result.password,
        host=result.hostname,
        port=result.port
    )
    
    
def search_recipe(recipe_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT recipeid, title, description, timestamp, servingsize, 
                   totalcalories, caloriesperserving, adderid, 
                   approved_modid, approved_status
            FROM Recipe
            WHERE RecipeID = %s;
        """
        cursor.execute(query, (recipe_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"Search Recipe Error: {e}")
        return None