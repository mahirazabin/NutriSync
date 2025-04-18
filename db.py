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

def create_user(name, email, phone_no, password, aid, user_flag):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO "user" (name, email, phone_no, password, aid, userflag)
            VALUES (%s, %s, %s, %s, %s, %s);
        """
        cursor.execute(query, (name, email, phone_no, password, aid, user_flag))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Create User Error: {e}")

def get_user(userid):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT userid, name, email, phone_no, password, aid, userflag
            FROM "user"
            WHERE userid = %s;
        """
        cursor.execute(query, (userid,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"Get User Error: {e}")
        return None
    
def get_users_by_role(role):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT userid, name, email, phone_no, aid
            FROM "user"
            WHERE userflag = %s;
        """
        cursor.execute(query, (role,))
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"Get Users by Role Error: {e}")
        return []


def delete_user(userid):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM \"user\" WHERE userid = %s;"
        cursor.execute(query, (userid,))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Delete User Error: {e}")

def authenticate_user(email, password):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT userid, name, email, phone_no, password, aid, userflag
            FROM "User"
            WHERE email = %s AND password = %s;
        """
        cursor.execute(query, (email, password))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"Authentication Error: {e}")
        return None   
    
def update_user_info(userid, name=None, email=None, phone_no=None, password=None):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        updates = []
        params = []

        if name:
            updates.append("name = %s")
            params.append(name)
        if email:
            updates.append("email = %s")
            params.append(email)
        if phone_no:
            updates.append("phone_no = %s")
            params.append(phone_no)
        if password:
            updates.append("password = %s")
            params.append(password)

        if not updates:
            print("No fields provided to update.")
            return False

        query = f"""
            UPDATE "user"
            SET {', '.join(updates)}
            WHERE userid = %s;
        """
        params.append(userid)

        cursor.execute(query, tuple(params))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Update User Info Error: {e}")
        return False

   
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
    except Exception as e:
        print(f"View Ingredient Error: {e}")
       
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
        print(f"View Ingredient Error: {e}")
    
def delete_ingredient(ingredientID, userID):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        user = get_user(userID)
        if user[-1] == 1:
            query = """
                DELETE FROM ingredient
                WHERE ingredientid = %s;
            """
            cursor.execute(query, (ingredientID,))
        else:
            print("Access Denied: User is not an admin")
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Delete Ingredient Error: {e}")

def view_recipe_ingredient(recipeID):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT I.ingredientid, I.name, I.calories, I.unit, I.moderatorid
            FROM ingredients_contains_recipe C
            JOIN ingredient I ON C.ingredientid = I.ingredientid
            WHERE C.recipeid = %s;
        """
        cursor.execute(query, (recipeID,))
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"View Recipe Ingredient Error: {e}")

def create_category(name , userID):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        user = get_user(userID)
        print(type(user))
        if user[-1] == 1:
            query = """
                INSERT INTO category (name, moderatorid)
                VALUES (%s, %s);
            """
            cursor.execute(query, (name, userID))
        else:
            print("Access Denied: User is not an admin")
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Create Category Error: {e}")
    
def delete_category(categoryID, userID):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        user = get_user(userID)
        if user[-1] == 1:
            query = """
                DELETE FROM category
                WHERE categoryid = %s;
            """
            cursor.execute(query, (categoryID,))
        else:
            print("Access Denied: User is not an admin")
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Delete Category Error: {e}")

def view_category(categoryID):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT categoryid, name, moderatorid
            FROM category
            WHERE CategoryID = %s;
        """
        cursor.execute(query, (categoryID,))
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"View Category Error: {e}")

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
        print(f"View Category Error: {e}")

def view_recipe_category(recipeID):
        try:
            conn = get_connection()
            cursor = conn.cursor()
            query = """
                SELECT C.categoryid, C.name, C.moderatorid
                FROM category_belongs_recipe B
                JOIN category C ON B.categoryid = C.categoryid
                WHERE B.recipeid = %s;
            """
            cursor.execute(query, (recipeID,))
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        except Exception as e:
            print(f"Select Category Error: {e}")

def approve_recipe(recipe_id, approved_mod_id, approved_status):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT C.categoryid, C.name, C.moderatorid
            FROM category_belongs_recipe B
            JOIN category C ON B.categoryid = C.categoryid
            WHERE B.recipeid = %s;
        """
        cursor.execute(query, (recipe_id,))
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"View Recipe Category Error: {e}")

def track_recipe(userID, recipeID, servingSize):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        recipe = search_recipe(recipeID)
        totalCalories = (recipe[5]/recipe[4]) * servingSize
        query = """
            UPDATE calorie_tracking
            SET totalcalories = totalcalories + %s
            WHERE userid = %s;
        """
        cursor.execute(query, (servingSize, userID))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Track Recipe Error: {e}")
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

def view_all_members():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT userid, name, email FROM "User"
            WHERE userflag = 0;
        """
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"View All Members Error: {e}")

def view_all_moderators():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT * FROM "User"
            WHERE userflag = 1;
        """
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"View All Members Error: {e}")

def admin_analytics_past_30_days():
    try:
        counts = { "recipes" : 0, "ingredients" : 0, "categories" : 0, "users" : 0 }
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT COUNT(*) FROM Recipe
            WHERE timestamp >= NOW() - INTERVAL '30 days';
        """
        cursor.execute(query)
        result = cursor.fetchone()
        counts["recipes"] = result[0]

        query = """
            SELECT COUNT(*) FROM Ingredients
        """
        cursor.execute(query)
        result = cursor.fetchone()
        counts["ingredients"] = result[0]

        query = """
            SELECT COUNT(*) FROM Ingredients
        """
        cursor.execute(query)
        result = cursor.fetchone()
        counts["categories"] = result[0]

        query = """
            SELECT COUNT(*) FROM \"User\"
        """
        cursor.execute(query)
        result = cursor.fetchone()
        counts["users"] = result[0]

        cursor.close()
        conn.close()
        return counts
    except Exception as e:
        print(f"New Recipes Past 30 Days Error: {e}")

def get_admin_by_id(admin_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            SELECT name, email, password
            FROM Admin
            WHERE adminid = %s;
        """
        cursor.execute(query, (admin_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        print(f"Get Admin by ID Error: {e}")