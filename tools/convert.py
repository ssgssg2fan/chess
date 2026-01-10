import re
import os

def clean_pgn_moves(pgn_text: str) -> str:
    """
    PGN 텍스트에서 시간표시, 코멘트 제거 후 공백 정리
    """
    # Remove clock annotations {[%clk ...]}
    cleaned = re.sub(r"\{\[%clk.*?\]\}", "", pgn_text)
    # Remove comments {}
    cleaned = re.sub(r"\{.*?\}", "", cleaned)
    # Remove multiple spaces
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip()

def convert_pgn_to_txt(pgn_path: str) -> str | None:
    """
    PGN 파일을 받아 TXT로 변환 후 경로 반환
    """

        return None

    # Load raw PGN
    with open(pgn_path, "r", encoding="utf-8") as f:
        raw = f.read()

    # Split into games
    games = raw.split("\n\n")

    cleaned_games = []
    for g in games:
        # Skip metadata lines like [Event "..."]
        moves_only = "\n".join(line for line in g.split("\n") if not line.startswith("["))
        cleaned_games.append(clean_pgn_moves(moves_only))

    # Save as TXT
    txt_path = pgn_path.replace(".pgn", ".txt")
    with open(txt_path, "w", encoding="utf-8") as f:
        for g in cleaned_games:
            if g.strip():
                f.write(g + "\n\n")

    return txt_path

if __name__ == "__main__":
    pgn_path = input("PGN 파일 경로 넣어라: ").strip()
    convert_pgn_to_txt(pgn_path)
