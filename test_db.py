import db

try:
    conn = db.get_connection()
    cursor = conn.cursor()

    # 1. ✅ Create a new test user
    cursor.execute("""
        INSERT INTO "user" (name, email, password, userflag)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
    """, ("Mahira", "mahira@email.com", "pass123", "admin"))

    inserted = cursor.fetchone()
    print("✅ Inserted user:", inserted)

    

    # 2. ✅ Test: Authenticate user (simulate login)
    print("\n🔐 Testing authentication...")
    cursor.execute("""
        SELECT * FROM "user"
        WHERE email = %s AND password = %s;
    """, ("testuser@email.com", "test123"))
    auth_user = cursor.fetchone()
    if auth_user:
        print("✅ Authenticated:", auth_user)
    else:
        print("❌ Authentication failed")

    # 3. ✅ Test: Get user by ID
    if auth_user:
        print("\n🔎 Testing get_user...")
        user_id = auth_user[0]
        cursor.execute("""SELECT * FROM "user" WHERE userid = %s;""", (user_id,))
        user_by_id = cursor.fetchone()
        print("✅ User by ID:", user_by_id)

    # 4. ✅ Test: Update user info
    print("\n✏️ Testing update_user (changing name + password)...")
    cursor.execute("""
        UPDATE "user"
        SET name = %s, password = %s
        WHERE email = %s;
    """, ("Updated User", "newpass123", "testuser@email.com"))
    conn.commit()

    cursor.execute("""
        SELECT * FROM "user"
        WHERE email = %s;
    """, ("testuser@email.com",))
    updated_user = cursor.fetchone()
    print("✅ Updated user:", updated_user)

    # 5. ✅ Test: Delete user
    print("\n🗑️ Testing delete_user...")
    cursor.execute("""DELETE FROM "user" WHERE email = %s;""", ("testuser@email.com",))
    conn.commit()
    print("✅ User deleted.")

    # 6. ✅ Confirm deletion
    cursor.execute("""SELECT * FROM "user" WHERE email = %s;""", ("testuser@email.com",))
    if cursor.fetchone():
        print("❌ Deletion failed.")
    else:
        print("✅ Confirmed: user no longer exists.")

    cursor.execute("SELECT current_database(), current_schema();")
    print("🧠 Connected to:", cursor.fetchone())

    cursor.close()
    conn.close()

except Exception as e:
    print("❌ Error:", e)
