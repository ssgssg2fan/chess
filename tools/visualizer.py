import re

class MoveInfo:
    def __init__(self, turn, color, san, label, delta):
        self.turn = turn
        self.color = color
        self.san = san
        self.label = label
        self.delta = delta

def parse_evaluated_txt(path):
    moves = []
    pattern = re.compile(r"(\d+)\s+(W|B)\.\s+(\S+)\s+\[(.*?)\].*Δ=([-\d.]+)")
    with open(path, encoding="utf-8") as f:
        for line in f:
            m = pattern.search(line)
            if m:
                turn = int(m.group(1))
                color = m.group(2)
                san = m.group(3)
                label = m.group(4)
                delta = float(m.group(5))
                moves.append(MoveInfo(turn, color, san, label, delta))
    return moves
