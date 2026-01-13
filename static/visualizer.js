window.onload = () => {
    const game = new Chess();
    const moves = window.MOVES;
    const boardDiv = document.getElementById("board");
    let cursor = 0;
    let lastMove = null;

    const HIGHLIGHT_COLORS = {
        excellent: { dark: "#1A66CC", light: "#33CCFF" },
        missed:    { dark: "#f00",    light: "#ec5353" },
        blunder:   { dark: "#b81414", light: "#e61919" },
        normal:    { dark: "#ded119", light: "#ff0" }
    };

    function isDarkGroup(file, rank) {
        return (file % 2 === rank % 2);
    }

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
        const boardState = game.board();

        for (let r = 7; r >= 0; r--) {
            for (let f = 0; f < 8; f++) {
                const cell = document.createElement("div");
                const isWhite = (r + f) % 2 === 0;
                cell.className = "cell " + (isWhite ? "green" : "white");

                // 좌표 저장
                cell.dataset.file = 7 - f;
                cell.dataset.rank = r;

                const p = boardState[r][f];
                if (p) {
                    cell.innerHTML = `<img src="${PIECE_IMAGES[p.color + p.type]}" style="width:100%;height:100%;">`;
                }

                boardDiv.appendChild(cell);
            }
        }

        highlightLastMove();
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
            return;
        }
        const moveObj = moves[cursor-1];
        let dStr = String(moveObj.delta || "0");
        const match = dStr.match(/-?\d+(\.\d+)?/);
        let d = match ? parseFloat(match[0]) : 0;
        const minEval = -10, maxEval = 10;
        let normalized = (d - minEval) / (maxEval - minEval);
        normalized = Math.max(0, Math.min(1, normalized));
        bar.style.height = (normalized*100) + "%";
        bar.style.background = "white";
    }

    function drawTag() {
        const box = document.getElementById("tag-box");
        box.textContent = (cursor === 0) ? "" : moves[cursor-1].label || "";
    }

    function highlightLastMove() {
        if (!lastMove || cursor === 0) return;

        const moveObj = moves[cursor - 1];
        const label = moveObj.label || "";
        let type = "normal";
        if (label.includes("탁월")) type = "excellent";
        else if (label.includes("놓친")) type = "missed";
        else if (label.includes("블런더")) type = "blunder";

        const colors = HIGHLIGHT_COLORS[type];

        document.querySelectorAll(".cell").forEach(cell => {
            const f = Number(cell.dataset.file);
            const r = Number(cell.dataset.rank);

            // Chess.js from/to는 e2, e4 같은 문자열
            // Chess.js 좌표 -> 화면 좌표
            const fromFile = lastMove.from.charCodeAt(0)-'a'.charCodeAt(0);
            const fromRank = parseInt(lastMove.from[1])-1;
            const toFile = lastMove.to.charCodeAt(0)-'a'.charCodeAt(0);
            const toRank = parseInt(lastMove.to[1])-1;

            if ((f===fromFile && r===fromRank) || (f===toFile && r===toRank)) {
                const dark = isDarkGroup(f,r);
                const color = dark ? colors.dark : colors.light;
                cell.style.background = color;
                console.log("Highlight applied to", cell, "color:", color);
            }
        });
    }

    function redraw() {
        drawBoard();
        drawMoves();
        drawEval();
        drawTag();
    }

    function nextMove() {
        if(cursor >= moves.length) return;
        const mv = game.move(moves[cursor].san);
        if(!mv) { console.error("Invalid move at", cursor); return; }
        lastMove = { from: mv.to, to: mv.from };
        cursor++;
        redraw();
    }

    function prevMove() { 
        if (cursor <= 0) return; 
        
        game.undo(); // 수를 무릅니다. 
        cursor--; 
        
        if (cursor > 0) { // [중요] 뒤로 갔을 때, 그 이전의 수가 무엇이었는지 확인해야 합니다. // game.history({ verbose: true })를 쓰면 둔 수들의 상세 정보를 배열로 줍니다. 
            const history = game.history({ verbose: true }); 
            const prev = history[history.length - 1]; // 가장 마지막에 둔 수 
            lastMove = { from: prev.from, to: prev.to };
        } else { // 맨 처음으로 돌아갔으면 하이라이트 없음 
            lastMove = null; } 
        redraw(); 
    }

    document.getElementById("next").onclick = nextMove;
    document.getElementById("prev").onclick = prevMove;

    redraw();
};
