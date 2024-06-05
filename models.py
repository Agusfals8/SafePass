from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from os import environ
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    passwords = db.relationship('Password', backref='owner', lazy=True)

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Password(db.Model):
    __tablename__ = 'passwords'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    website = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(64), nullable=False)
    encrypted_password = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return '<Password for {}>'.format(self.website)