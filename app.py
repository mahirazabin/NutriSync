import base64
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import db as db
from flask import Flask, request, render_template
import db
app = Flask(__name__, template_folder='templates', static_folder='static')


cors = CORS(app, resources={r"/*": {"origins": "*"}})


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
        return jsonify({"message": "Recipe not found"}), 404


@app.route("/test/<int:categoryid>")
def test(categoryid):
    print(db.view_category(categoryid))
    print(db.delete_category(categoryid, 1))
    db.create_category("Test Category", 1)
    
    return render_template("index.html", image=get_default_picture())

if __name__ == "__main__":
    app.run(debug=True)