import base64
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import db as db
from flask import Flask, request, render_template
import db
app = Flask(__name__, template_folder='templates', static_folder='static')

def get_default_picture():
    with open("images/default_recipe.png", "rb") as image_file:
        binary_data = image_file.read()
        return base64.b64encode(binary_data).decode("utf-8")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/recipes/<int:recipe_id>")
def recipe_page(recipe_id):
    result = db.search_recipe(recipe_id)
    if result:
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
        return render_template("recipe.html", recipe=recipe)
    else:
        return render_template("404.html"), 404
    
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
# -------------------------------------------------- RECIPES --------------------------------------------------
@app.route("/api/member/<int:id>/ingredient", methods=["GET"])
def get_ingredients(id):
    ingredients = db.get_all_ingredient()
    if ingredients:
        ingredients_json = []
        for ingredient in ingredients:
            x = {
                "ingredientID": ingredient[0],
                "ingredientName": ingredient[1]
            }
            ingredients_json.append(x)
        return jsonify(ingredients_json)
    else:
        return jsonify([{"message": "No Ingredients Found"}])

@app.route("/api/member/<int:id>/category", methods=["GET"])
def get_categories(id):
    categories = db.get_all_category()
    if categories:
        categories_json = []
        for category in categories:
            x = {
                "categoryID": category[0],
                "categoryName": category[1]
            }
            categories_json.append(x)
        return jsonify(categories_json)
    else:
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

    total_calories = 0
    for ingredient in ingredients:
        ingredient_id = ingredient.get("id")
        quantity = ingredient.get("quantity")
        calories = db.get_calories_by_ingredient(ingredient_id)
        total_calories += calories[0] * quantity

    recipe_id = db.create_recipe(title, descriptions,servings,total_calories, id, image_url)
    for ingredient in ingredients:
        db.add_recipe_ingredient(recipe_id, ingredient.get("id"), ingredient.get("quantity"))
    for category in categories:
        db.add_recipe_category(recipe_id, category.get("id"))

# -------------------------------------------------- MEMBER --------------------------------------------------

@app.route("/api/member/<int:id>", methods=["GET"])
def member_page(id):
    analytics = db.member_added_recipe_count(id)[0]
    member = db.get_user(id)
    if member:
        member_name = member[1]
        json_obj = {
            "Name": member_name,
            "recipe": analytics
        }
        return jsonify(json_obj)
    else:
        return None
    
@app.route("/api/member/<int:userid>/tracker/recipe", methods=["GET"])
def get_tracked_recipes(userid):
    recipes = db.get_tracked_recipes_by_id(userid)
    if recipes:
        recipes_json = []
        for recipe in recipes:
            x = {
                "id": recipe[0],
                "name": recipe[1],
                "calories" : recipe[2]
            }
            recipes_json.append(x)
        return jsonify(recipes_json)
    else:
        return jsonify([{"id": "0", "name": "—", "calories": 0}])

@app.route("/api/member/<int:userid>/tracker/delete/<int:recipeid>", methods=["DELETE"])
def delete_tracked_recipe(userid, recipeid):
    if userid != 0:
        db.remove_recipe_from_tracker(userid, recipeid)

@app.route("/api/member/<int:id>/calorie", methods=["GET"])
def get_calories(id):
    calories = db.get_total_calories(id)
    print(calories)
    if calories:
        return jsonify([int(calories)])
    else:
        return jsonify([0])

@app.route("/api/member/<int:userid>/profile", methods=["GET"])
def get_profile(userid):
    user = db.get_user(userid)
    if user:
        user_json = {
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "phoneno": user[3],
            "password": user[4],
            "access": "Moderator" if user[6] == 2 else "Member",
        }
        return jsonify(user_json)
    else:
        return None
    
@app.route("/api/member/<int:userid>/profile/update", methods=["POST"])
def update_profile(userid):
    db.update_user_info(userid, request.json["name"], request.json["email"], request.json["phoneno"], request.json["password"])

@app.route("/api/member/<int:userid>/recipe", methods=["GET"])
def get_user_recipes(userid):
    recipes = db.get_recipes_of_user(userid)
    if recipes:
        recipes_json = []
        for recipe in recipes:
            x = {
                "id": recipe[0],
                "name": recipe[1],
                "servings" : recipe[4],
                "calories" : recipe[5],
                "approved" : recipe[8],
                "image" : recipe[9]
            }
            recipes_json.append(x)
        return jsonify(recipes_json)
    else:
        return jsonify([{"id": "—", "name": "—", "servings": 0 , "calories": 0, "approved": 0, "image": "—"}])

@app.route("/api/member/<int:userid>/liked", methods=["GET"])
def get_liked_recipes(userid):
    recipes = db.get_liked_recipes(userid)
    if recipes:
        recipes_json = []
        for recipe in recipes:
            x = {
                "id": recipe[0],
                "name": recipe[1],
                "servings" : recipe[4],
                "calories" : recipe[5],
                "approved" : recipe[8],
                "image" : recipe[9]
            }
            recipes_json.append(x)
        return jsonify(recipes_json)
    else:
                return jsonify([{"id": "—", "name": "—", "servings": 0 , "calories": 0, "approved": 0, "image": "—"}])

# -------------------------------------------------- ADMIN --------------------------------------------------

@app.route("/api/admin/<int:admin_id>", methods=["GET"])
def admin_page(admin_id):
    analytics = db.admin_analytics_past_30_days()
    admin = db.get_admin_by_id(admin_id)
    if admin:
        admin_name = admin[0]   
        json_obj = {
            "adminName": admin_name,
            "analytics": analytics
        }
        return jsonify(json_obj)
    else:
        return jsonify({"adminName": "None", "analytics": "None"})

@app.route("/api/admin/<int:id>/manage-member/", methods=["GET"])
def view_all_members(id):
    members = db.view_all_members()
    if members:
        members_json = []
        for member in members:
            x = {
                "userID": member[0],
                "name": member[1],
                "email": member[2]
            }
            members_json.append(x)
        return jsonify(members_json)
    else:
        return jsonify([{"userID": "No Active Members", "name": "—", "email": "example@email.com"}])

@app.route("/api/admin/<int:id>/manage-moderator/", methods=["GET"])
def view_all_moderators(id):
    moderators = db.view_all_moderators()
    if moderators:
        moderator_json = []
        for moderator in moderators:
            x = {
                "userID": moderator[0],
                "name": moderator[1],
                "email": moderator[2]
            }
            moderator_json.append(x)
        return jsonify(moderator_json)
    else:
        return jsonify([{"userID": "No Active Moderators", "name": "-", "email": "example@email.com"}]) 
 
@app.route("/api/admin/<int:id>/<string:action>", methods=["POST"])
def manage_user(id, action):
    data = request.get_json()
    user_id = data.get("user_ids")
    if action == "assign":
        for uid in user_id:
            db.assign_member(uid, id)
        return jsonify({"message": "User approved successfully"})
    elif action == "blacklist":
        for uid in user_id:
            db.ban_user(uid, id)
        return jsonify({"message": "User banned successfully"})
    elif action == "unassign":
        for uid in user_id:
            db.unassign_moderator(uid, id)
        return jsonify({"message": "User unbanned successfully"})
    else:
        return jsonify({"message": "Invalid action"}), 400
if __name__ == "__main__":
    app.run(debug=True)