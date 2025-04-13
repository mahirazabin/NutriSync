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
    
def create_admin(admin_id, name, email, password):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = "INSERT INTO Admin VALUES (%s, %s, %s, %s);"
        cursor.execute(query, (admin_id, name, email, password))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Create Admin Error: {e}")  
    
def update_admin(admin_id, name, email, password):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE Admin
            SET Name = %s, Email = %s, Password = %s
            WHERE AdminID = %s;
        """
        cursor.execute(query, (name, email, password, admin_id))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Update Admin Error: {e}")

   
def search_recipe(recipe_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT recipeid, title, description, timestamp, servingsize, 
                   totalcalories, adderid, approved_modid, approved_status, image_url
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
       
def select_ingredients(ingredient_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT Name, Calories, Unit FROM Ingredient WHERE IngredientID = %s;"
        cursor.execute(query, (ingredient_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"Select Ingredients Error: {e}")
        return None

def select_category(category_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = "SELECT Name FROM Category WHERE CategoryID = %s;"
        cursor.execute(query, (category_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"Select Category Error: {e}")
        return None

def approve_recipe(recipe_id, approved_mod_id, approved_status):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE Recipe
            SET Approved_ModID = %s, Approved_Status = %s
            WHERE RecipeID = %s;
        """
        cursor.execute(query, (approved_mod_id, approved_status, recipe_id))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Approve Recipe Error: {e}")

def create_recipe(recipe_id, title, description, serving_size, total_calories, adder_id, image_url):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO Recipe(recipeid, title, description, timestamp, servingsize, 
                   totalcalories, adderid, approved_modid, approved_status, image_url)
            VALUES (%s, %s, %s, NOW(), %s, %s, %s, False, %s);
        """
        cursor.execute(query, (recipe_id, title, description, serving_size, total_calories, adder_id, image_url))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Create Recipe Error: {e}")

def delete_recipe(recipe_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM Recipe WHERE RecipeID = %s;"
        cursor.execute(query, (recipe_id,))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Delete Recipe Error: {e}")

def like_recipe(user_id, recipe_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO Like (UserID, RecipeID, TimeStamp)
            VALUES (%s, %s, NOW());
        """
        cursor.execute(query, (user_id, recipe_id))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Like Recipe Error: {e}")