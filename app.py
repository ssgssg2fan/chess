import os
from flask import Flask, render_template
from tools.chess_tool import run as chess_run

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chess")
def chess():
    result = chess_run()
    return render_template("chess.html", result=result)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)