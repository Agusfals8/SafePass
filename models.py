from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from os import environ
from dotenv import load_dotenv
from cryptography.fernet import Fernet
import base64

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()

def generate_key():
    return Fernet.generate_key()

fernet_key = environ.get('FERNET_KEY', generate_key())
f = Fernet(fernet_key)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    passwords = db.relationship('Password', backref='owner', lazy=True)

    def __repr__(self):
        return '<User {}>'.format(self.username)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Password(db.Model):
    __tablename__ = 'passwords'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    website = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(64), nullable=False)
    encrypted_password = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return '<Password for {}>'.format(self.website)

    def encrypt_password(self, password):
        self.encrypted_password = base64.encodebytes(f.encrypt(password.encode())).decode()

    def decrypt_password(self):
        return f.decrypt(base64.decodebytes(self.encrypted_password.encode())).decode()