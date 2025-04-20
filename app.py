import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session
import db
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__, template_folder='templates', static_folder='static')
load_dotenv()
app.secret_key = os.getenv('secret_key', 'dev_key')

# ✅ Root route to confirm API is running
@app.route("/")
def home():
    return {"message": "NutriSync API running on Flask!"}

# ---------------------------- AUTH ----------------------------
@app.route('/api/signup', methods=['POST'])
def signup_api():
    data = request.get_json() or {}
    name     = data.get('name')
    email    = data.get('email')    
    password = data.get('password')
    phone_no = data.get('phone_no')
    if not all([name, email, password, phone_no]):
        return jsonify({'error': 'Missing fields'}), 400
    try:
        db.create_user(name, email, phone_no, password, None, 1)
        return jsonify({'message': 'User created'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login_api():
    data = request.get_json() or {}
    email    = data.get('email')
    password = data.get('password')
    user = db.authenticate_user(email, password)
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    session['user_id'] = user[0]
    session['user_name'] = user[1]
    session['role'] = user[6]
    return jsonify({'message': 'Logged in', 'user': {'UserID': user[0], 'UserName': user[1], 'Role': user[6]}}), 200

@app.route('/api/user')
def get_user_api():
    user_id = session.get('user_id')
    user_name = session.get('user_name')
    role = session.get('role')
    if not user_id:
        return jsonify({'error': 'Not logged in'}), 401
    return jsonify({'UserID': user_id, 'UserName': user_name, 'Role': role}), 200

@app.route('/api/user/recipes')
def user_recipes_api():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not logged in'}), 401
    rows = db.get_recipes_by_user(user_id)
    recipes = [{
        'RecipeID': row[0],
        'Title': row[1],
        'Description': row[2],
        'TimeStamp': row[3].isoformat() if hasattr(row[3], 'isoformat') else row[3],
        'Serving_Size': row[4],
        'TotalCalories': row[5],
        'ImageURL': row[6],
    } for row in rows]
    return jsonify(recipes), 200

@app.route('/api/recipes/pending')
def list_pending_recipes():
    rows = db.list_all_pending_recipes()
    recipes = [{
        'RecipeID': row[0],
        'Title': row[1],
        'Description': row[2],
        'TimeStamp': row[3].isoformat() if hasattr(row[3], 'isoformat') else row[3],
        'Serving_Size': row[4],
        'TotalCalories': row[5],
        'AdderID': row[6],
        'Approved_ModID': row[7],
        'Approved_Status': bool(row[8]),
        'ImageURL': row[9],
    } for row in rows]
    return jsonify(recipes)

@app.route("/api/recipes/<int:recipe_id>", methods=["GET"])
def recipe_api(recipe_id):
    result = db.search_recipe(recipe_id)
    if result:
        recipe = {
            "RecipeID": result[0],
            "Title": result[1],
            "Description": result[2],
            "TimeStamp": result[3],
            "Serving_Size": result[4],
            "TotalCalories": result[5],
            "AdderID": result[7],
            "Approved_ModID": result[8],
            "Approved_Status": result[9]
        }
        return jsonify(recipe), 200
    else:
        return jsonify({"message": "Recipe not found"})

# ---------------------------- MEMBER ROUTES ----------------------------
@app.route("/api/member/<int:id>/ingredient", methods=["GET"])
def get_ingredients(id):
    ingredients = db.get_all_ingredient()
    if ingredients:
        return jsonify([{"ingredientID": i[0], "ingredientName": i[1]} for i in ingredients])
    return jsonify([{"message": "No Ingredients Found"}])

@app.route("/api/member/<int:id>/category", methods=["GET"])
def get_categories(id):
    categories = db.get_all_category()
    if categories:
        return jsonify([{"categoryID": c[0], "categoryName": c[1]} for c in categories])
    return jsonify([{"message": "No Categories Found"}])

@app.route("/api/member/<int:id>/add-recipe", methods=["POST"])
def add_recipe(id):
    data = request.get_json()
    title = data.get("title")
    descriptions = data.get("description")
    servings = data.get("servingSize")
    ingredients = data.get("ingredients")
    categories = data.get("categories")
    image_url = data.get("imageURL")

    total_calories = sum(db.get_calories_by_ingredient(i.get("id"))[0] * i.get("quantity") for i in ingredients)
    recipe_id = db.create_recipe(title, descriptions, servings, total_calories, id, image_url)

    for ingredient in ingredients:
        db.add_recipe_ingredient(recipe_id, ingredient.get("id"), ingredient.get("quantity"))
    for category in categories:
        db.add_recipe_category(recipe_id, category.get("id"))

    return jsonify({"message": "Recipe added successfully", "RecipeID": recipe_id}), 201

@app.route("/api/member/<int:id>", methods=["GET"])
def member_page(id):
    member = db.get_user(id)
    recipes = db.get_recipes_by_user(id)
    if member:
        return jsonify({
            "id": member[0],
            "name": member[1],
            "email": member[2],
            "recipe": len(recipes) 
        })
    return jsonify({"error": "Member not found"}), 404

@app.route("/api/member/<int:userid>/tracker/recipe", methods=["GET"])
def get_tracked_recipes(userid):
    recipes = db.get_tracked_recipes_by_id(userid)
    if recipes:
        return jsonify([
            {
                "id": recipe[0],
                "name": recipe[1],
                "calories": recipe[2]
            } for recipe in recipes
        ])
    else:
        return jsonify([])  # Empty list instead of default object



@app.route("/api/member/<int:id>/calorie", methods=["GET"])
def get_calories(id):
    calories = db.get_total_calories(id)
    if calories:
        return jsonify([int(calories)])
    else:
        return jsonify([0])


# ✅ Run Flask on port 5001
if __name__ == "__main__":
    app.run(debug=True, port=5001)