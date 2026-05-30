from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from prompt_creation import promptcreation
from pymongo import MongoClient
import os
import gridfs
from bson.objectid import ObjectId
import json

import ollama

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client['jwt_db']
users_collection = db['users']
fs = gridfs.GridFS(db)

def query_rag(prompt):
    stream = ollama.chat(
        model='phi3',
        messages=[{'role': 'user', 'content': prompt}],
        stream=True,
    )
    for chunk in stream:
        yield f"{chunk['message']['content']}"

@app.route('/submit-expense', methods=['POST','GET'])
def submit_expense():
    expense_data = request.json

    transaction_date = expense_data['transactionDate']
    business_purpose = expense_data['businessPurpose']
    vendor_description = expense_data['vendorDescription']
    city = expense_data['city']
    payment_type = expense_data['paymentType']
    amount = expense_data['amount']
    currency = expense_data['currency']
    tax_posted_amount = expense_data['taxAndPostedAmount']
    personal_expense = expense_data['personalExpense']
    comment = expense_data['comment']
    name = expense_data['name']
    email = expense_data['email']

    formatted_expense_store = {
        "transactionDate": transaction_date,
        "businessPurpose": business_purpose,
        "vendorDescription": vendor_description,
        "city": city,
        "paymentType": payment_type,
        "amount": amount,
        "currency": currency,
        "taxAndPostedAmount": tax_posted_amount,
        "personalExpense": personal_expense,
        "comment": comment,
        "response_from_query_rag": ""
    }

    formatted_expense = f"Transaction date: {transaction_date},\n" \
                        f"Business purpose: {business_purpose},\n" \
                        f"Vendor description: {vendor_description},\n" \
                        f"City: {city},\n" \
                        f"Payment type: {payment_type},\n" \
                        f"Amount: {amount},\n" \
                        f"Currency: {currency},\n" \
                        f"Tax posted amount: {tax_posted_amount},\n" \
                        f"Comment: {comment},\n" \
                        f"Personal expense: {personal_expense},\n"\
                        f"Name: {name}"

    print(formatted_expense)
    
    def generate():
        prompt = promptcreation(formatted_expense)
        full_result = ""
        for chunk in query_rag(prompt):
            full_result += chunk
            yield chunk

        # Once the generator finishes rendering all chunks, update MongoDB
        formatted_expense_store['response_from_query_rag'] = full_result
        print("Saving generated feedback to DB:", full_result)

        user = users_collection.find_one({"email": email})
        if user:
            users_collection.update_one({"email": email}, {"$push": {"details": formatted_expense_store}})
        else:
            users_collection.insert_one({"email": email, "details": [formatted_expense_store]})

    return Response(generate(), content_type='text/plain')

@app.route('/user-expenses/<email>', methods=['GET'])
def get_user_expenses(email):
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "User not found"}), 404

    details = user.get("details", [])
    for detail in details:
        if "receiptFileId" in detail:
            receipt_file_id = detail["receiptFileId"]
            if receipt_file_id:
                detail["receipt"] = f"/receipt/{receipt_file_id}"

    return jsonify(details)


if __name__ == '__main__':
    app.run(debug=True, port=5001)

