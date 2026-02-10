from flask import Flask, render_template, request, jsonify
from model import ask_lyra

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_query = data.get("query", "")

    if not user_query:
        return jsonify({"response": "Please enter a valid message."})

    response = ask_lyra(user_query)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
