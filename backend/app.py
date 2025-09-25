from flask import Flask, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from datetime import datetime
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)  # allow requests from frontend (React)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client.college_event
users_collection = db.users

# -------------------------
# Sign Up API
# -------------------------
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    reg_no=data.get("reg_no")
    name=data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")  # 'admin', 'organizer', 'student'
    department=data.get("department")
    year=data.get("year")
    created_at=datetime.utcnow()

    if not reg_no or not name or not email or not password or not role or not department or not year:
        return jsonify({"success": False, "message": "All fields are required"})

    # Check if user already exists
    if users_collection.find_one({"email": email}) or users_collection.find_one({"reg_no":reg_no}):

        return jsonify({"success": False, "message": "User already exists"})
    # Hash the password
    hashed_password = generate_password_hash(password)

    # Insert new user

    new_user={
        "reg_no":reg_no,
        "name":name,
        "email": email,
        "password": hashed_password,
        "role": role,
        "department":department,
        "year":year,
        "created_at":created_at
    }
    users_collection.insert_one(new_user)
    print(new_user)

    return jsonify({"success": True, "message": "User registered successfully"})


# -------------------------
# Sign In API
# -------------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    reg_no=data.get("reg_no")
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})
    if not user:
        print("User not found")
        return jsonify({"success": False, "message": "User not found"})

    if check_password_hash(user["password"], password):
        print(f"User Signed In \n Email: {user["email"]}")
        return jsonify({"success": True, "role": user["role"]})
    else:
        print(f"User Found but Invalid Password \n Email: {user}")
        return jsonify({"success": False, "message": "Invalid password"})
    

#---------------------------
# Show all users to admin
#----------------------------
@app.route("/api/users", methods=["GET"])
def get_users():
    users = list(users_collection.find({}, {"password": 0}))  # exclude passwords
    for u in users:
        u["_id"] = str(u["_id"])  # ObjectId to string
        u["created_at"] = u["created_at"].strftime("%Y-%m-%d %H:%M:%S")
    return jsonify(users)


# -------------------------------
# Add new user (admin)
# -------------------------------
@app.route("/api/users", methods=["POST"])
def add_user():
    data = request.json
    reg_no=data.get("reg_no")
    name=data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")  # 'admin', 'organizer', 'student'
    department=data.get("department")
    year=data.get("year")
    created_at=datetime.utcnow()

    if not reg_no or not name or not email or not password or not role or not department or not year:
        return jsonify({"success": False, "message": "All fields are required"})

    # Check if user already exists
    if users_collection.find_one({"email": email}) or users_collection.find_one({"reg_no":reg_no}):

        return jsonify({"success": False, "message": "Admin User already exists"})
    # Hash the password
    hashed_password = generate_password_hash(password)

    # Insert new user

    new_user={
        "reg_no":reg_no,
        "name":name,
        "email": email,
        "password": hashed_password,
        "role": role,
        "department":department,
        "year":year,
        "created_at":created_at
    }
    users_collection.insert_one(new_user)
    print(new_user)

    return jsonify({"success": True, "message": "Admin User Added successfully"})

# -------------------------------
# Edit existing user (admin)
# -------------------------------

@app.route("/api/users/<user_id>", methods=["PUT"])
def edit_user(user_id):
    data = request.json
    update_data = {
        "reg_no": data.get("reg_no"),
        "name": data.get("name"),
        "email": data.get("email"),
        "role": data.get("role"),
        "department": data.get("department"),
        "year": data.get("year")
    }

    # Optionally update password if provided
    if data.get("password"):
        update_data["password"] = generate_password_hash(data["password"])

    result = users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
    if result.modified_count:
        return jsonify({"success": True, "message": "User updated successfully"})
    return jsonify({"success": False, "message": "No changes made"})

# -------------------------------
# Delete a user (admin)
# -------------------------------

@app.route("/api/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count:
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "User not found"})

# -------------------------
# Run the server
# -------------------------
if __name__ == "__main__":
    try:
        app.run(debug=True)
    except:
        print("\nServer stopped by user")

