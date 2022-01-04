// Modules
const gameBoard = (() => {
    const board = [["x", "o", "x"],
                   ["x", "x", "x"],
                   ["o", "o", "o"]];

    const displayBoard = function() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const boardItem = document.createElement("div");
                boardItem.classList.add("board-grid-container");
                boardItem.textContent = board[row][col];
                
                boardContainer.appendChild(boardItem);
            }
        }
    }

    return { displayBoard };
})();

// Factory Functions
const playerFactory = function() {

}

const gameFlowFactory = function() {

}

const boardContainer = document.querySelector(".board-container");

// Might delete later
gameBoard.displayBoard();