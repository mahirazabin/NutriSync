import base64
from flask import Flask, request, jsonify, render_template
import db as db
app = Flask(__name__, template_folder='templates', static_folder='static')

def get_default_picture():
    with open("images/default_recipe.png", "rb") as image_file:
        binary_data = image_file.read()
        return base64.b64encode(binary_data).decode("utf-8")

@app.route("/")
def index():
    return render_template("index.html", image = get_default_picture())       

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
            "AdderID": result[7],
            "Approved_ModID": result[8],
            "Approved_Status": result[9]
        }
        return render_template("recipe.html", recipe=recipe)
    else:
        return render_template("404.html"), 404

@app.route("/test/<int:ingredientid>")
def test(ingredientid):
    # print(db.view_ingredient(ingredientid))
    # print(db.delete_ingredient(ingredientid))
    # db.create_ingredient("Test Ingredient", 500, "100 grams", 1)
    
    return render_template("index.html", image=get_default_picture())

if __name__ == "__main__":
    app.run(debug=True)