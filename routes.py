from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

@app.route('/store', methods=['POST'])
def store_secure_data():
    secure_data = request.json
    return jsonify({"message": "Data stored successfully"}), 201

@app.route('/retrieve/<secure_data_id>', methods=['GET'])
def retrieve_secure_data(secure_data_id):
    retrieved_data = {}
    if retrieved_data:
        return jsonify(retrieved_data), 200
    else:
        return jsonify({"message": "Data not found"}), 404

@app.route('/delete/<secure_data_id>', methods=['DELETE'])
def delete_secure_data(secure_data_id):
    deletion_success_count = 1
    if deletion_success_count:
        return jsonify({"message": "Data deleted successfully"}), 200
    else:
        return jsonify({"message": "Data not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)