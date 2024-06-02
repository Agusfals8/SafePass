from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

from routes import *

if __name__ == '__main__':
    app.run(debug=True, host=os.getenv('HOST', '127.0.0.1'), port=int(os.getenv('PORT', 5000)))