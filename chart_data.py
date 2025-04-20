from flask import Flask, jsonify
import db

app = Flask(__name__)

@app.route('/api/recipes/chart')
def get_recipe_chart_data():
    try:
        conn = db.get_connection()
        cursor = conn.cursor()

        # Get number of approved recipes per day
        cursor.execute("""
            SELECT 
                to_char(created_at, 'YYYY-MM-DD') AS date,
                COUNT(*) AS count
            FROM Recipe
            WHERE approved_status = true
            GROUP BY date
            ORDER BY date;
        """)

        rows = cursor.fetchall()
        chart_data = [{"date": row[0], "count": row[1]} for row in rows]

        cursor.close()
        conn.close()
        return jsonify(chart_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
