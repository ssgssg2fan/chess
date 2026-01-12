
window.onload = () => {
    const game = new Chess();
    const moves = window.MOVES;
    const boardDiv = document.getElementById("board"); // ✅ 여기 선언
    let tags = [];
    let cur = 0;
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
    
    function drawBoard() {
            boardDiv.innerHTML = "";
        for (let r = 7; r >= 0; r--) {
            for (let f = 0; f < 8; f++) {
                const cell = document.createElement("div");
                const isWhite = (r + f) % 2 === 0;
                cell.className = "cell " + (isWhite ? "green" : "white");

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
    }
    
    function drawMoves() {
        const div = document.getElementById("moves");
        div.innerHTML = "";
        for(let i=0;i<moves.length;i+=2){
            const W = moves[i];
            const B = moves[i+1];
            const line = document.createElement("div");
            line.className = "move" + (i===cursor-1 ? " active" : "");
            line.textContent = `${(i/2+1)}. ${W.san} ` + (B ? ` ${B.san} ` : "");
            div.appendChild(line);
        }
    }
    
    function drawEval() {
    const bar = document.getElementById("evalfill");
    if(cursor === 0){
        bar.style.height = "50%";
        bar.style.background = "white";
        console.log("cursor=0, raw delta='0', parsed delta=0");
        return;
    }

    // moves 배열에서 현재 move 문자열 전체 확인
    const moveObj = moves[cursor-1];
    console.log("cursor="+cursor+", full move object:", moveObj);

    // delta 문자열 가져오기
    let dStr = moveObj.delta;  // ex: "슥슥0.32이"
    console.log("cursor="+cursor+", raw delta='"+dStr+"'");

    // 문자열 아닌 경우 처리
    if(typeof dStr !== "string") dStr = String(dStr);

    // 숫자 부분만 추출
    const match = dStr.match(/-?\d+(\.\d+)?/);
    let d = 0;
    if(match) d = parseFloat(match[0]);

    console.log("cursor="+cursor+", parsed delta="+d);

    // 평가 막대 범위 설정
    const minEval = -10; // 0%
    const maxEval = 10;  // 100%, 필요하면 조정
    // 평가값 정규화: minEval -> 0, maxEval -> 100%
    let normalized = (d - minEval) / (maxEval - minEval);

    // clamp 0~1
    normalized = Math.max(0, Math.min(1, normalized));

    bar.style.height = (normalized*100) + "%";
    bar.style.background = "white";

    console.log(`cursor=${cursor}, delta=${d}, normalized=${normalized}`);
}
    function drawTag() {
    if (cursor === 0) return;
    console.log(moves[cursor - 1].label);
    }


    function redraw() {
    drawBoard();
    drawMoves();
    drawEval();
    drawTag();
    }
    
// nextMove/prevMove 통합
    function nextMove() {
        if(cursor >= moves.length) return;
        const mv = game.move(moves[cursor].san);
        lastMove = { from: mv.from, to: mv.to };
        cursor++;
        drawBoard();
        drawMoves();
        drawEval();
    }

    function prevMove() {
        if(cursor <= 0) return;
        game.undo();
        cursor--;
        lastMove = null;
        drawBoard();
        drawMoves();
        drawEval();
    }


    document.getElementById("next").onclick = nextMove;
    document.getElementById("prev").onclick = prevMove;

    redraw();
};



