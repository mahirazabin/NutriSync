import db
import json
import os

try:
    conn = db.get_connection()
    cursor = conn.cursor()

    # 🟦 1. Line Chart: Approved Recipes Per Day
    cursor.execute("""
        SELECT 
            to_char(timestamp, 'YYYY-MM-DD') AS date,
            COUNT(*) AS count
        FROM recipe
        WHERE approved_status = true
        GROUP BY date
        ORDER BY date;
    """)

    line_data = [{"date": row[0], "count": row[1]} for row in cursor.fetchall()]

    with open('./frontend/public/chart-data.json', 'w') as f:

        json.dump(line_data, f, indent=2)
        print("✅ Line chart data written to chart-data.json")

    # 🥧 2. Pie Chart: Approval Status Breakdown
    cursor.execute("""
        SELECT approved_status, COUNT(*)
        FROM recipe
        GROUP BY approved_status;
    """)

    pie_data = [
        {"status": "Approved" if row[0] else "Unapproved", "count": row[1]}
        for row in cursor.fetchall()
    ]

    with open('./frontend/public/approval-pie.json', 'w') as f:
        json.dump(pie_data, f, indent=2)
        print("✅ Pie chart data written to approval-pie.json")

    cursor.close()
    conn.close()

except Exception as e:
    print("❌ Error:", e)

# Optional: confirm path
print("📁 Current working directory:", os.getcwd())
