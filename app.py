from flask import Flask, request, render_template
from db import search_recipe
app = Flask(__name__, template_folder='templates', static_folder='static')

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