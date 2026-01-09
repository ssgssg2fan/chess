window.onload = () => {
    const game = new Chess();
    const moves = window.MOVES;

    let cursor = 0;
    let lastMove = null;

    const PIECE_IMAGES = {
        wp: "/static/pieces/wp.png", wn: "/static/pieces/wn.png",
        wb: "/static/pieces/wb.png", wr: "/static/pieces/wr.png",
        wq: "/static/pieces/wq.png", wk: "/static/pieces/wk.png",
        bp: "/static/pieces/bp.png", bn: "/static/pieces/bn.png",
        bb: "/static/pieces/bb.png", br: "/static/pieces/br.png",
        bq: "/static/pieces/bq.png", bk: "/static/pieces/bk.png"
    };
    for (let r = 7; r >= 0; r--) {
        for (let f = 0; f < 8; f++) {
            const cell = document.createElement("div");
            const isWhite = (r + f) % 2 === 0;
            cell.className = "cell " + (isWhite ? "white" : "green");

            // 좌우 반전 적용
            const fileIndex = 7 - f;

            const sq = r*8 + fileIndex;
            if(lastMove && (sq === lastMove.from || sq === lastMove.to)) {
                cell.classList.add("highlight");
            }
            
            const boardState = game.board(); // 8x8 배열
            const p = boardState[r][fileIndex]; 
            if(p) cell.innerHTML = `<img src="${PIECE_IMAGES[p.color+p.type]}" style="width:100%;height:100%;">`;

            boardDiv.appendChild(cell);
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
    if(cursor === 0){
        bar.style.height = "50%";
        bar.style.background = "black";
        return;
    }

    // delta 문자열을 숫자로 변환
    let d = moves[cursor-1].delta;
    if(typeof d === "string") {
        d = parseFloat(d);  // "11.00" -> 11
    }

    // 평가 막대 범위 설정, 예: -100 ~ +100 -> 0~100%
    const maxEval = 100;  // 데이터 기준으로 조정 가능
    const normalized = (d + maxEval) / (2*maxEval); // 0~1

    bar.style.height = (normalized*100) + "%";
    bar.style.background = d >= 0 ? "black" : "white";
    }


    function redraw() {
        drawBoard();
        drawMoves();
        drawEval();
    }

    function nextMove() {
        if(cursor >= moves.length) return;
        const mv = game.move(moves[cursor].san);
        lastMove = { from: mv.from, to: mv.to };
        cursor++;
        redraw();
    }

    function prevMove() {
        if(cursor <= 0) return;
        game.undo();
        cursor--;
        lastMove = null;
    }

    document.getElementById("next").onclick = nextMove;
    document.getElementById("prev").onclick = prevMove;

    redraw();
};


redraw();
