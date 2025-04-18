import base64
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import db as db
from flask import Flask, request, render_template
import db
app = Flask(__name__, template_folder='templates', static_folder='static')


cors = CORS(app, resources={r"/*": {"origins": "*"}})



@app.route("/ping", methods=["GET"])
def ping():
    return "pong", 200

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

@app.route("/admin/<int:admin_id>", methods=["GET"])
def admin_page(admin_id):
    analytics = db.admin_analytics_past_30_days()
    # TODO: make a display chart stuff for analytics
    admin = db.get_admin_by_id(admin_id)
    admin_name = admin[0]   
    # pass everything to frontend

@app.route("/admin/manage-member/", methods=["GET"])
def view_all_members():
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
        return jsonify({"message": "No Members Found"})

@app.route("/admin/manage-moderator/", methods=["GET"])
def view_all_moderators():
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
        return jsonify({"message": "No Members Found"})    


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    print("🔐 Received login request:", data)

    email = data.get("email")
    password = data.get("password")
    print("📩 Email:", email, "🔑 Password:", password)

    try:
        user = db.authenticate_user(email, password)
        print("🎯 DB User:", user)

        if user:
            return jsonify({
                "userid": user[0],
                "name": user[1],
                "email": user[2],
                "userflag": user[6],
                "message": "Login successful"
            }), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        print("❌ Login error:", e)
        return jsonify({"message": "Server error"}), 500
print("🚨 Route hit")


if __name__ == "__main__":
    app.run(debug=True)