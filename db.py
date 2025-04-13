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
    
def get_user(userid):
    # placeholder function to get the user from their userid
    return [1]


def create_ingredient(name , calories, unit, userID):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        user = get_user(userID)
        if user[-1] == 1:
            query = """
                INSERT INTO ingredient (name, calories, unit, moderatorid)
                VALUES (%s, %s, %s, %s);
            """
            cursor.execute(query, (name, calories, unit, userID))
        else:
            print("Access Denied: User is not an admin")
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Create Ingredient Error: {e}")
        return None
    

def view_ingredient(ingredientID):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT ingredientid, name, calories, unit, moderatorid
            FROM ingredient
            WHERE IngredientID = %s;
        """
        cursor.execute(query, (ingredientID,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"View Ingredient Error: {e}")
    
def delete_ingredient(ingredientID):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            DELETE FROM ingredient
            WHERE ingredientid = %s;
        """
        cursor.execute(query, (ingredientID,))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Delete Ingredient Error: {e}")
