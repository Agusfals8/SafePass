from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///safepass.db')

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

def init_db():
    try:
        db.create_all()
    except Exception as e:
        print(f"An error occurred while creating the database: {e}")

def add_user(username):
    try:
        new_user = User(username=username)
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        print(f"An error occurred while adding a new user: {e}")
        db.session.rollback()

@app.route('/add_user/<username>', methods=['POST'])
def add_user_route(username):
    try:
        add_user(username)
        return jsonify({"success": True, "message": "User added successfully."}), 201
    except Exception as e:
        return jsonify({"success": False, "message": "Failed to add user."}), 500

if __name__ == "__main__":
    app.run(debug=True)