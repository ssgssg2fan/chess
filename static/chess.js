<script>
const moves = {{ moves|tojson }};

const game = new Chess();   // chess.js
let cursor = 0;

function drawBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  const position = game.board(); // 8x8

  for (let r = 7; r >= 0; r--) {
    for (let f = 0; f < 8; f++) {
      const cell = document.createElement("div");
      cell.className = "cell " + ((r + f) % 2 ? "white" : "black");

      const piece = position[r][f];
      if (piece) {
        const map = {
          wp:"♙", wn:"♘", wb:"♗", wr:"♖", wq:"♕", wk:"♔",
          bp:"♟", bn:"♞", bb:"♝", br:"♜", bq:"♛", bk:"♚"
        };
        cell.textContent = map[piece.color + piece.type];
      }
      boardDiv.appendChild(cell);
    }
  }
}

function drawEvalBar() {
  const bar = document.getElementById("evalfill");
  if (cursor === 0) {
    bar.style.height = "50%";
    return;
  }
  const delta = moves[cursor-1].delta;
  const v = Math.max(-10, Math.min(10, delta));
  bar.style.height = ((v + 10) / 20 * 100) + "%";
  bar.style.background = v >= 0 ? "black" : "white";
}

function nextMove() {
  if (cursor >= moves.length) return;
  game.move(moves[cursor].san);
  cursor++;
  drawBoard();
  drawEvalBar();
}

function prevMove() {
  if (cursor <= 0) return;
  game.undo();
  cursor--;
  drawBoard();
  drawEvalBar();
}

document.getElementById("next").onclick = nextMove;
document.getElementById("prev").onclick = prevMove;

drawBoard();
drawEvalBar();
</script>
