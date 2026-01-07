import os
from flask import Flask, render_template
from tools.chess_tool import run as chess_run
from tools.evaluator import evaluate_pgn

app = Flask(__name__)

@app.route("/evaluate", methods=["POST"])
def evaluate():
    file = request.files["pgn"]
    pgn_path = os.path.join("uploads", file.filename)
    file.save(pgn_path)
    result_path = evaluate_pgn(pgn_path, "results")
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
