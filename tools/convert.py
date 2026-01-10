# tools/convert.py
import re
import os
from werkzeug.utils import secure_filename

def clean_pgn_moves(pgn_text: str) -> str:
    # 시계 주석 제거
    cleaned = re.sub(r"\{\[%clk.*?\]\}", "", pgn_text)
    # 일반 주석 제거
    cleaned = re.sub(r"\{.*?\}", "", cleaned)
    # 연속 공백 제거
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip()

def convert_pgn_to_txt(pgn_path: str, save_dir: str = None) -> str:
    """
    PGN 파일을 받아서 클린한 TXT 파일로 저장하고 경로 반환
    save_dir: TXT 저장 경로 (없으면 pgn과 같은 폴더)
    """
    if not os.path.exists(pgn_path):
        raise FileNotFoundError("PGN 파일 경로가 존재하지 않습니다.")

    # PGN 로드
    with open(pgn_path, "r", encoding="utf-8") as f:
        raw = f.read()

    # 게임 단위 분리 (빈 줄 기준)
    games = raw.split("\n\n")

    cleaned_games = []
    for g in games:
        # [Event ...] 등 메타데이터 제거
        moves_only = "\n".join(line for line in g.split("\n") if not line.startswith("["))
        cleaned_games.append(clean_pgn_moves(moves_only))

    # 저장 경로
    if save_dir:
        os.makedirs(save_dir, exist_ok=True)
        txt_path = os.path.join(save_dir, secure_filename(os.path.basename(pgn_path).replace(".pgn", ".txt")))
    else:
        txt_path = pgn_path.replace(".pgn", ".txt")

    # TXT로 저장
    with open(txt_path, "w", encoding="utf-8") as f:
        for g in cleaned_games:
            if g.strip():
                f.write(g + "\n\n")

    return txt_path
