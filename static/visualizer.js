const game = new Chess();
console.log("Chess =", typeof Chess);
const moves = window.MOVES;

let cursor = 0;
let lastMove = null;

const pieceMap = {
  wp:"♙", wn:"♘", wb:"♗", wr:"♖", wq:"♕", wk:"♔",
  bp:"♟", bn:"♞", bb:"♝", br:"♜", bq:"♛", bk:"♚"
};

function drawBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  const pos = game.board();

  for (let r = 7; r >= 0; r--) {
    for (let f = 0; f < 8; f++) {
      const cell = document.createElement("div");
      const isWhite = (r + f) % 2 === 0;
      cell.className = "cell " + (isWhite ? "white" : "green");

      const sq = r * 8 + f;
      if (lastMove && (sq === lastMove.from || sq === lastMove.to)) {
        cell.classList.add("highlight");
      }

      const p = pos[r][f];
      if (p) cell.textContent = pieceMap[p.color + p.type];

      boardDiv.appendChild(cell);
    }
  }
}

function drawMoves() {
  const div = document.getElementById("moves");
  div.innerHTML = "";

  moves.forEach((m, i) => {
    const d = document.createElement("div");
    d.className = "move" + (i === cursor-1 ? " active" : "");
    const turn = i % 2 === 0 ? `${(i+2)/2}W.` : `${(i+1)/2}B.`;
    d.textContent = `${turn} ${m.san} [${m.label}]`;
    div.appendChild(d);
  });
}

function drawEval() {
  const bar = document.getElementById("evalfill");
  if (cursor === 0) {
    bar.style.height = "50%";
    bar.style.background = "black";
    return;
  }

  const d = Math.max(-10, Math.min(10, moves[cursor-1].delta));
  bar.style.height = ((d + 10) / 20 * 100) + "%";
  bar.style.background = d >= 0 ? "black" : "white";
}

function nextMove() {
  if (cursor >= moves.length) return;
  const mv = game.move(moves[cursor].san);
  lastMove = { from: mv.from, to: mv.to };
  cursor++;
  redraw();
}

function prevMove() {
  if (cursor <= 0) return;
  game.undo();
  cursor--;
  lastMove = null;
  redraw();
}

function redraw() {
  drawBoard();
  drawMoves();
  drawEval();
}

document.getElementById("next").onclick = nextMove;
document.getElementById("prev").onclick = prevMove;

redraw();
