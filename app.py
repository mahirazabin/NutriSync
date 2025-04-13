import base64
from flask import Flask, request, jsonify, render_template

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route("/")
def home():
    with open("images/default_recipe.png", "rb") as image_file:
        binary_data = image_file.read()
        base64_data = base64.b64encode(binary_data).decode("utf-8")
        return render_template("index.html", image = base64_data)

@app.route("/recipe")
def recipe():
    return render_template("recipe.html")

if __name__ == "__main__":
    app.run(debug=True)