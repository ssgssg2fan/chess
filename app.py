import os
import re
from flask import Flask, render_template, request, send_file
from tools.chess_tool import run as chess_run
from tools.evaluator import evaluate_pgn

UPLOAD_DIR = "/tmp/uploads"
RESULT_DIR = "/tmp/results"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULT_DIR, exist_ok=True)

app = Flask(__name__, static_folder="static")

@app.route("/evaluate", methods=["POST"])
def evaluate():
    if "file" not in request.files:
        return "NO FILE", 400

    file = request.files["file"]

    if file.filename == "":
        return "EMPTY FILE", 400

    UPLOAD_DIR = "/tmp"
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    depth = int(request.form.get("depth", 12))
    max_time = float(request.form.get("max_time", 3.0))

    pgn_path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(pgn_path)

    RESULT_DIR = "/tmp/results"
    os.makedirs(RESULT_DIR, exist_ok=True)

    result_path = evaluate_pgn(pgn_path, RESULT_DIR, depth=depth, max_time=max_time)
    return send_file(result_path, as_attachment=True)

    log_path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(log_path)

    # 평가된 기보를 읽어서 moves 리스트로 변환
    moves = []
    import re
    pattern = re.compile(r"\d+\s+(W|B)\.\s+(\S+)\s+\[(.*?)\]")
    with open(log_path, encoding="utf-8") as f:
        for line in f:
            m = pattern.search(line)
            if m:
                moves.append({
                    "turn": int(line.split()[0]),
                    "color": m.group(1),
                    "san": m.group(2),
                    "label": m.group(3),
                    "delta": float(m.group(5))
                })

    # moves를 HTML에 전달
    return render_template("visualizer.html", moves=moves)
    
@app.route("/visualize", methods=["GET", "POST"])
def visualize():
    if request.method == "GET":
        # GET이면 그냥 메인으로 보내
        return redirect("/")

    # POST 처리
    if "file" not in request.files:
        return "NO FILE", 400

    file = request.files["file"]
    if file.filename == "":
        return "EMPTY FILE", 400

    log_path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(log_path)

    moves = []
    pattern = re.compile(r"\d+\s+(W|B)\.\s+(\S+)\s+\[(.*?)\]")
    with open(log_path, encoding="utf-8") as f:
        for line in f:
            m = pattern.search(line)
            if m:
                moves.append({
                    "color": m.group(1),
                    "san": m.group(2),
                    "label": m.group(3),
                    "turn": int(line.split()[0]),
                    "delta": 0
                })

    return render_template("visualizer.html", moves=moves)

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
