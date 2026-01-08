import os
from flask import Flask, render_template, request, send_file
from tools.chess_tool import run as chess_run
from tools.evaluator import evaluate_pgn

app = Flask(__name__)

@app.route("/evaluate", methods=["POST"])
def evaluate():
    if "file" not in request.files:
        return "NO FILE", 400

    file = request.files["file"]

    if file.filename == "":
        return "EMPTY FILE", 400

    UPLOAD_DIR = "/tmp"
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    pgn_path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(pgn_path)

    RESULT_DIR = "/tmp/results"
    os.makedirs(RESULT_DIR, exist_ok=True)

    result_path = evaluate_pgn(pgn_path, RESULT_DIR)
    return send_file(result_path, as_attachment=True)
    
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
