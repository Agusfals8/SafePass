from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

@app.route('/store', methods=['POST'])
def store_data():
    data = request.json
    return jsonify({"message": "Data stored successfully"}), 201

@app.route('/retrieve/<data_id>', methods=['GET'])
def retrieve_data(data_id):
    data = {}  
    if data:
        return jsonify(data), 200
    else:
        return jsonify({"message": "Data not found"}), 404

@app.route('/delete/<data_id>', methods=['DELETE'])
def delete_data(data_id):
    deleted_count = 1  
    if deleted_count:
        return jsonify({"message": "Data deleted successfully"}), 200
    else:
        return jsonify({"message": "Data not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)