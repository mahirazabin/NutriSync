from flask import Flask, jsonify, request, render_template
import db

import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route("/")
def home():
    return render_template("index.html")


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
        db.delete_ingredient(ingredient_id)
        return jsonify({'message': 'Ingredient deleted'}), 200
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