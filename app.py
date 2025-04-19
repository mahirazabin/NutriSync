import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request, render_template, session
import db

import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__, template_folder='templates', static_folder='static')

load_dotenv()

app.secret_key = os.getenv('secret_key', 'dev_key') 

@app.route("/")
def home():
    return render_template("index.html")

# Signup a new member
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
        db.create_user(name, email, phone_no, password, None, 3) # 3 is member, 2 is mod, 1 is admin
        return jsonify({'message': 'User created'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Login and set session
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
    session['role']    = user[6]
    print(user)
    return jsonify({'message': 'Logged in', 'user': {'UserID': user[0], 'UserName': user[1], 'Role': user[6]}}), 200

# Tell the front end who’s logged in
@app.route('/api/user')
def get_user_api():
    user_id = session.get('user_id')
    user_name = session.get('user_name')
    print(user_name)
    role = session.get('role')
    if not user_id:
        return jsonify({'error': 'Not logged in'}), 401
    return jsonify({'UserID': user_id, 'UserName': user_name, 'Role': role}), 200

#Return all of the recipes created by that user (created only for now)
@app.route('/api/user/recipes')
def user_recipes_api():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not logged in'}), 401

    rows = db.get_recipes_by_user(user_id)
    recipes = [{
        'RecipeID':      row[0],
        'Title':         row[1],
        'Description':   row[2],
        'TimeStamp':     row[3].isoformat() if hasattr(row[3], 'isoformat') else row[3],
        'Serving_Size':  row[4],
        'TotalCalories': row[5],
        'ImageURL':      row[6],
    } for row in rows]

    return jsonify(recipes), 200

@app.route('/api/recipes/pending')
def list_pending_recipes():
    rows = db.list_all_pending_recipes()

    recipes = [{
        'RecipeID':        row[0],
        'Title':           row[1],
        'Description':     row[2],
        'TimeStamp':       row[3].isoformat() if hasattr(row[3], 'isoformat') else row[3],
        'Serving_Size':    row[4],
        'TotalCalories':   row[5],
        'AdderID':         row[6],
        'Approved_ModID':  row[7],
        'Approved_Status': bool(row[8]),
        'ImageURL':        row[9],
    } for row in rows]

    return jsonify(recipes)


@app.route("/api/recipes/<int:recipe_id>")
def recipe_page(recipe_id):
    result = db.search_recipe(recipe_id)
    if not result:
        return jsonify({"error": "not found"}), 404
    
    recipe = {
        "RecipeID": result[0],
        "Title": result[1],
        "Description": result[2],
        "TimeStamp": result[3],
        "Serving_Size": result[4],
        "TotalCalories": result[5],
        "AdderID": result[6],
        "Approved_ModID": result[7],
        "Approved_Status": result[8],
        "ImageURL": result[9]
    }
    return jsonify(recipe)

    
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
        return jsonify({"message": "Recipe not found"}), 404

@app.route('/api/recipe/<int:recipe_id>/approve', methods=['POST'])
def approve_recipe_api(recipe_id):
    mod_id = 123   # Placeholder
    try:
        db.approve_recipe(recipe_id, mod_id)
        return jsonify({ 'message': 'Recipe approved', 'RecipeID': recipe_id }), 200
    except Exception as e:
        app.logger.exception("Error approving recipe")   
        return jsonify({ 'error': str(e) }), 500

@app.route('/api/recipe/<int:recipe_id>/reject', methods=['POST'])
def reject_recipe_api(recipe_id):
    """
    Reject (delete) a pending recipe.
    """
    try:
        db.reject_recipe(recipe_id)
        return jsonify({ 'message': 'Recipe rejected and deleted', 'RecipeID': recipe_id }), 200
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500
    
# Ingredients list for recipe
@app.route('/api/recipe/<int:recipe_id>/ingredients')
def recipe_ingredients_api(recipe_id):
    rows = db.view_recipe_ingredient(recipe_id)
    items = [
        {'ingredientID': r[0], 'name': r[1], 'calories': r[2], 'unit': r[3]}
        for r in rows
    ]
    return jsonify(items)

# Categories list for recipe
@app.route('/api/recipe/<int:recipe_id>/categories')
def recipe_categories_api(recipe_id):
    rows = db.get_categories_for_recipe(recipe_id)
    cats = [{'categoryID': c[0], 'name': c[1]} for c in rows]
    return jsonify(cats)
    

# @app.route("/login", methods=["POST"])
# def login():
#     data = request.get_json()
#     print("🔐 Received login request:", data)

#     email = data.get("email")
#     password = data.get("password")
#     print("📩 Email:", email, "🔑 Password:", password)

#     try:
#         user = db.authenticate_user(email, password)
#         print("🎯 DB User:", user)

#         if user:
#             return jsonify({
#                 "userid": user[0],
#                 "name": user[1],
#                 "email": user[2],
#                 "userflag": user[6],
#                 "message": "Login successful"
#             }), 200
#         else:
#             return jsonify({"message": "Invalid credentials"}), 401
#     except Exception as e:
#         print("❌ Login error:", e)
#         return jsonify({"message": "Server error"}), 500

    
# List all ingredients
@app.route('/api/ingredients')
def list_ingredients():
    rows = db.get_all_ingredients()
    ingredients = [
        {
            'ingredientID': row[0],
            'name': row[1],
            'calories': row[2],
            'unit': row[3],
            'moderatorID': row[4]
        } for row in rows
    ]
    return jsonify(ingredients)

# Create a new ingredient
@app.route('/api/ingredient', methods=['POST'])
def create_ingredient_api():
    data = request.get_json() or {}
    name = data.get('name')
    calories = data.get('calories')
    unit = data.get('unit')
    moderator_id = 123 # Placeholder
    if not all([name, isinstance(calories, int), moderator_id]):
        return jsonify({'error': 'Missing name, calories, or moderatorID'}), 400
    try:
        db.create_ingredient(name, calories, unit or '', moderator_id)
        return jsonify({'message': 'Ingredient created'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Delete an ingredient
@app.route('/api/ingredient/<int:ingredient_id>', methods=['DELETE'])
def delete_ingredient_api(ingredient_id):
    try:
        db.delete_ingredient(ingredient_id, 123)
        return jsonify({'message': 'Ingredient deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
# List all categories
@app.route('/api/categories')
def list_categories():
    rows = db.get_all_categories()
    categories = [
        {
            'categoryID': row[0],
            'name': row[1],
            'moderatorID': row[2]
        } for row in rows
    ]
    return jsonify(categories)

# Create a new category
@app.route('/api/category', methods=['POST'])
def create_category_api():
    data = request.get_json() or {}
    name = data.get('name')
    moderator_id = data.get('moderatorID')
    if not all([name, isinstance(moderator_id, int)]):
        return jsonify({'error': 'Missing name or moderatorID'}), 400
    try:
        db.create_category(name, moderator_id)
        return jsonify({'message': 'Category created'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete a category
@app.route('/api/category/<int:category_id>', methods=['DELETE'])
def delete_category_api(category_id):
    try:
        db.delete_category(category_id, 123)
        return jsonify({'message': 'Category deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route("/test/<int:categoryid>")
def test(categoryid):
    print(db.view_category(categoryid))
    print(db.delete_category(categoryid, 1))
    db.create_category("Test Category", 1)
    
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)