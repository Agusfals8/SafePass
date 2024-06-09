from flask import Flask
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
    db.create_all()

def add_user(username):
    new_user = User(username=username)
    db.session.add(new_user)
    db.session.commit()

if __name__ == "__main__":
    app.run(debug=True)