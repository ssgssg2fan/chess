import time
import os
import chess
import chess.pgn
import chess.engine

# =====================
# 설정
# =====================
STRICTNESS = 6
STRICT_DEGREE = (5 - STRICTNESS / 2) * 100
MATE_SCORE = 10000
DEFAULT_DEPTH = 12
DEFAULT_TIME = 3.0
STOCKFISH_PATH = "/usr/games/stockfish"

# =====================
# 유틸
# =====================
def safe_cp(score):
    if score is None:
        return 0
    return score.white().score(mate_score=MATE_SCORE)

def is_sacrifice(board, move):
    if not board.is_capture(move):
        return False
    captured = board.piece_at(move.to_square)
    mover = board.piece_at(move.from_square)
    if not captured or not mover:
        return False
    return mover.piece_type > captured.piece_type

def classify_move(board, chosen, scored, post_eval):
    best_mv, best_eval = scored[0]
    second_eval = scored[1][1] if len(scored) > 1 else best_eval

    delta = best_eval - post_eval

    if abs(delta) >= 500:
        return "blunder(??)", 3, delta

    if chosen == best_mv:
        if abs(best_eval - second_eval) >= STRICT_DEGREE:
            return "great(star)", 0, delta
        if is_sacrifice(board, chosen):
            return "fu**n great(!!)", 0, delta
        return "far even heavy great(!)", 0, delta

    if delta < STRICT_DEGREE:
        return "good(daboong)", 0, delta

    if 500 > delta > STRICT_DEGREE:
        return "missed(x)", 0, delta

    return "ordinary(..)", 0, delta

# =====================
# 웹용 메인 함수
# =====================
def evaluate_pgn(
    pgn_path: str,
    output_dir: str,
    depth: int = 12,
    max_time: float = 3.0
) -> str:

    
    with open(pgn_path, encoding="utf-8") as f:
        game = chess.pgn.read_game(f)

    if game is None:
        raise ValueError("PGN 로드 실패")

    os.makedirs(output_dir, exist_ok=True)

    out_path = os.path.join(
        output_dir,
        "evaluated_" + os.path.basename(pgn_path)
    )

    engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)
    engine.configure({"Threads": 2})

    board = chess.Board()
    mistake_points = 0
    move_count = 0

    with open(out_path, "w", encoding="utf-8") as out:
        for move in game.mainline_moves():

            # =====================
            # 1. 수 두기 전 평가
            # =====================
            pre_info = engine.analyse(
                board,
                chess.engine.Limit(depth=depth, time=max_time),
                multipv=STRICTNESS
            )

            scored = []
            for pv in pre_info:
                if "pv" in pv and pv["pv"]:
                    scored.append((pv["pv"][0], safe_cp(pv["score"])))
            scored.sort(key=lambda x: x[1], reverse=True)

            # =====================
            # 2. 수 두기
            # =====================
            san = board.san(move)
            board.push(move)

            # =====================
            # 3. 수 둔 후 평가
            # =====================
            post_info = engine.analyse(
                board,
                chess.engine.Limit(depth=depth, time=max_time),
                multipv=1
            )
            post_eval = safe_cp(post_info[0]["score"])

            # =====================
            # 4. 분류
            # =====================
            label, penalty, delta = classify_move(board, move, scored, post_eval)

            mistake_points += penalty
            move_count += 1

            if move_count % 2 == 1:
                turn = (move_count + 1) // 2
                prefix = f"{turn} W."
            else:
                turn = move_count // 2
                prefix = f"{turn} B."

            # =====================
            # 5. 기록 / 출력
            # =====================
            out.write(
                f"{prefix:<6} {san:<8} "
                f"[{label}]  Δ=슥슥{post_eval/100:.2f}\n이"
            )

            time.sleep(0.1)

        final_accuracy = max(0.0, (1 - mistake_points / move_count) * 100)
        out.write("\n=== 최종 정확도 ===\n")
        out.write(f"Accuracy: {final_accuracy:.1f}%\n")

    engine.quit()
    return out_path
