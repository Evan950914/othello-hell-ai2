const board = [];
const SIZE = 8;
let currentPlayer = "black";

function createBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    for (let row = 0; row < SIZE; row++) {
        board[row] = [];
        for (let col = 0; col < SIZE; col++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = row;
            cell.dataset.col = col;
            boardDiv.appendChild(cell);
            board[row][col] = null;
        }
    }

    // 初始棋子
    placePiece(3, 3, "white");
    placePiece(3, 4, "black");
    placePiece(4, 3, "black");
    placePiece(4, 4, "white");

    updateScore();
    setTimeout(aiMove, 800);
}

function placePiece(row, col, color) {
    board[row][col] = color;
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    const piece = document.createElement("div");
    piece.className = "piece " + color;
    cell.innerHTML = "";
    cell.appendChild(piece);
}

function aiMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (board[row][col] === null) {
                board[row][col] = "white";
                let score = evaluateBoard();
                board[row][col] = null;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row, col };
                }
            }
        }
    }

    if (bestMove) {
        placePiece(bestMove.row, bestMove.col, "white");
        currentPlayer = "black";
        updateScore();
    }
}

function evaluateBoard() {
    let score = 0;
    const cornerBonus = 30;
    const corners = [
        [0,0],[0,7],[7,0],[7,7]
    ];

    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (board[row][col] === "white") score += 1;
            if (board[row][col] === "black") score -= 1;
        }
    }

    // 加強角落優勢
    for (let [r, c] of corners) {
        if (board[r][c] === "white") score += cornerBonus;
        if (board[r][c] === "black") score -= cornerBonus;
    }

    return score;
}

function updateScore() {
    const score = evaluateBoard();
    let text = "評分：AI 盤面分數：" + (score >= 0 ? "+" + score : score);
    document.getElementById("score").innerText = text;
}

createBoard();
