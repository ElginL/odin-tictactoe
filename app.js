// Modules
const gameBoard = (() => {
    const board = [["", "", ""],
                   ["", "", ""],
                   ["", "", ""]];

    const displayBoard = function() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const boardItem = document.createElement("div");
                boardItem.classList.add("board-grid-container");
                boardItem.textContent = board[row][col];
                boardItem.setAttribute("row", row);
                boardItem.setAttribute("col", col);
                boardItem.addEventListener("click", gameFlow.playRound);

                boardContainer.appendChild(boardItem);
            }
        }
    }

    const markBoard = function(marker, e) {
        const row = e.target.getAttribute("row");
        const col = e.target.getAttribute("col");
        if (board[row][col] === "") {
            e.target.textContent = marker;
            board[row][col] = marker;
        }
    }

    const checkDiagonalWinner = function(marker) {
        // Top left to bot right
        const topLeftToBotRight = board[0][0] === marker && board[1][1] === marker && board[2][2] === marker;
        const botLeftToTopRight = board[2][0] === marker && board[1][1] === marker && board[0][2] === marker;
        return topLeftToBotRight || botLeftToTopRight;
    }

    return { displayBoard, markBoard, checkDiagonalWinner };
})();

// Factory Functions
const playerFactory = function(marker) {
    const playerMarker = marker;
    const rows = [3, 3, 3];
    const cols = [3, 3, 3];

    const play = function(e) {
        rows[e.target.getAttribute("row")] -= 1;
        cols[e.target.getAttribute("col")] -= 1;
        gameBoard.markBoard(playerMarker, e);
    };

    const checkWin = function() {
        for (let i = 0; i < 3; i++) {
            if (rows[i] === 0 || cols[i] === 0 || gameBoard.checkDiagonalWinner(playerMarker)) {
                console.log(`${playerMarker} is the winner!`);
            }
        }
    };

    return { play, checkWin };
}

const gameFlow = (() => {
    const player1 = playerFactory("X");
    const player2 = playerFactory("O");

    let currentPlayer = player1;

    const playRound = function(e) {
        currentPlayer.play(e);
        currentPlayer.checkWin();
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    return { playRound };
})();

const boardContainer = document.querySelector(".board-container");

// Might delete later
gameBoard.displayBoard();