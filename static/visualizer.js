window.onload = () => {
    document.getElementById("next").onclick = nextMove;
    document.getElementById("prev").onclick = prevMove;
    redraw();
};

const game = new Chess();
console.log("Chess =", typeof Chess);
const moves = window.MOVES;

<div id="tag"></div>

function drawTag() {
    const tagDiv = document.getElementById("tag");
    tagDiv.textContent = cursor>0 ? moves[cursor-1].label : "";
}
function redraw(){
    drawBoard(); drawMoves(); drawEval(); drawTag();
}

<button id="flip">Flip Board</button>

document.getElementById("flip").onclick = ()=>{
  document.getElementById("board").classList.toggle("flipped");
}

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
      const isWhite = (r + f) % 2 !=== 0;
      cell.className = "cell " + (isWhite ? "white" : "green");

      const sq = r * 8 + f;
      if (lastMove && (sq === lastMove.from || sq === lastMove.to)) {
        cell.classList.add("highlight");
      }

      const p = pos[r][f];
        
      iconst PIECE_IMAGES = {
      wp: "/static/pieces/wp.png", wn: "/static/pieces/wn.png",
      wb: "/static/pieces/wb.png", wr: "/static/pieces/wr.png",
      wq: "/static/pieces/wq.png", wk: "/static/pieces/wk.png",
      bp: "/static/pieces/bp.png", bn: "/static/pieces/bn.png",
      bb: "/static/pieces/bb.png", br: "/static/pieces/br.png",
      bq: "/static/pieces/bq.png", bk: "/static/pieces/bk.png"
    };
    if (p) cell.innerHTML = `<img src="${PIECE_IMAGES[p.color+p.type]}" style="width:100%;height:100%;">`;


      boardDiv.appendChild(cell);
    }
  }
}

function drawMoves() {
  const div = document.getElementById("moves");
  div.innerHTML = "";

  for(let i=0;i<moves.length;i+=2){
    const W = moves[i];
    const B = moves[i+1];
    const line = document.createElement("div");
    line.className = "move" + (i===cursor-1 ? " active" : "");
    line.textContent = `${(i/2+1)}. ${W.san} [${W.label}]` + (B ? ` ${B.san} [${B.label}]` : "");
    div.appendChild(line);
}

}

function drawEval() {
  const bar = document.getElementById("evalfill");
  if(cursor===0){ bar.style.height="50%"; bar.style.background="black"; return; }
  const d = Math.max(-10, Math.min(10, moves[cursor-1].delta));
  bar.style.height = ((d+10)/20*100) + "%";
  bar.style.background = d>=0 ? "black" : "white";
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
