console.log("JS LOADED");
console.log(moves);
const moves = window.MOVES;
const game = new Chess();
let cursor = 0;
let lastMove = null;

const pieceMap = {
  wp:"♙", wn:"♘", wb:"♗", wr:"♖", wq:"♕", wk:"♔",
  bp:"♟", bn:"♞", bb:"♝", br:"♜", bq:"♛", bk:"♚"
};

function drawBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  const pos = game.board();

  for (let r = 7; r >= 0; r--) {
    for (let f = 0; f < 8; f++) {
      const c = document.createElement("div");
      c.className = "cell " + ((r+f)%2===0 ? "white":"green");

      const p = pos[r][f];
      if (p) c.textContent = pieceMap[p.color+p.type];
      board.appendChild(c);
    }
  }
}

function drawEval() {
  const bar = document.getElementById("evalfill");
  if (cursor === 0) {
    bar.style.height = "50%";
    bar.style.background = "black";
    return;
  }
  const d = Math.max(-10, Math.min(10, moves[cursor-1].delta));
  bar.style.height = ((d+10)/20*100)+"%";
  bar.style.background = d>=0 ? "black":"white";
}

function nextMove() {
  if (cursor >= moves.length) return;
  game.move(moves[cursor].san);
  cursor++;
  drawBoard(); drawEval();
}

function prevMove() {
  if (cursor <= 0) return;
  game.undo();
  cursor--;
  drawBoard(); drawEval();
}

document.getElementById("next").onclick = nextMove;
document.getElementById("prev").onclick = prevMove;

drawBoard();
drawEval();
