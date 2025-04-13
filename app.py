import base64
from flask import Flask, request, jsonify, render_template
from db import search_recipe
app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route("/")
def home():
    with open("images/default_recipe.png", "rb") as image_file:
        binary_data = image_file.read()
        base64_data = base64.b64encode(binary_data).decode("utf-8")
        return render_template("index.html", image = base64_data)

@app.route("/recipes/<int:recipe_id>")
def recipe_page(recipe_id):
    result = search_recipe(recipe_id)
    print(result)
    if result:
        recipe = {
            "RecipeID": result[0],
            "Title": result[1],
            "Description": result[2],
            "TimeStamp": result[3],
            "Serving_Size": result[4],
            "TotalCalories": result[5],
            "CaloriesPerServing": result[6],
            "AdderID": result[7],
            "Approved_ModID": result[8],
            "Approved_Status": result[9]
        }
        return render_template("recipe.html", recipe=recipe)
    else:
        return render_template("404.html"), 404
    
if __name__ == "__main__":
    app.run(debug=True)