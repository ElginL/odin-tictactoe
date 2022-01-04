// Modules
const gameBoard = (() => {
    const board = [["", "", ""],
                   ["", "", ""],
                   ["", "", ""]];

    const boardContainer = document.querySelector(".board-container");

    // Displayed board is empty
    const displayBoard = function() {
        boardContainer.innerHTML = ``;
        boardContainer.style.display = "grid";
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                board[row][col] = "";
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

    const hideBoard = function() {
        boardContainer.style.display = "none";
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
        const topLeftToBotRight = board[0][0] === marker && board[1][1] === marker && board[2][2] === marker;
        const botLeftToTopRight = board[2][0] === marker && board[1][1] === marker && board[0][2] === marker;
        return topLeftToBotRight || botLeftToTopRight;
    }

    return { displayBoard, markBoard, checkDiagonalWinner, hideBoard };
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
                UIController.displayEndGame();
                break;
            }
        }
    };

    return { play, checkWin };
}

const gameFlow = (() => {
    let player1 = playerFactory("X");
    let player2 = playerFactory("O");

    let currentPlayer = player1;

    const playRound = function(e) {
        currentPlayer.play(e);
        currentPlayer.checkWin();
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const reset = function() {
        player1 = playerFactory("X");
        player2 = playerFactory("O");
        currentPlayer = player1;
    }

    return { playRound, reset };
})();

const UIController = (() => {
    const modesContainer = document.querySelector(".mode-selection-container");
    const playerSetupContainer = document.querySelector(".player-setup-container");
    // const playerCardContainer = document.querySelector(".player-card-container");
    const modal = document.querySelector(".modal");

    const clearAllDisplay = function() {
        modesContainer.style.display = "none";
        modesContainer.innerHTML = ``;
        playerSetupContainer.style.display = "none";
        playerSetupContainer.innerHTML = ``;
        modal.style.display = "none";
        modal.innerHTML = ``;
    }

    const setUpMode = function() {
        clearAllDisplay();
        modesContainer.style.display = "flex";

        const createCard = function(text, imgSrc, btnHandler) {
            const container = document.createElement("div");
            container.classList.add("mode-container");
            const header = document.createElement("h2");
            header.textContent = text;
            const btn = document.createElement("button");
            btn.textContent = "Play";
            btn.addEventListener("click", btnHandler);
            const img = document.createElement("img");
            img.setAttribute("src", `images/${imgSrc}`);
            img.setAttribute("alt", `${text} icon`);
            container.appendChild(header);
            container.appendChild(btn);
            container.appendChild(img);
            modesContainer.appendChild(container);
        }

        // PVP card
        createCard("Player vs Player", "pvp.png", setUpPlayers);

        // Player vs AI card
        createCard("Player vs AI", "pvb.png", () => console.log("PVB"));
    };

    const setUpPlayers = function() {
        clearAllDisplay();
        playerSetupContainer.style.display = "flex";
        const playerCardContainer = document.createElement("div");
        playerCardContainer.classList.add("player-card-container");
        // modesContainer.style.display = "none";

        const createPlayerContainer = function(playerIndex) {
            const container = document.createElement("div");
            container.classList.add("player-container");
            const header = document.createElement("h2");
            header.textContent = playerIndex;
            const nameInput = document.createElement("input");
            nameInput.setAttribute("placeholder", "Enter your name");
            container.appendChild(header);
            container.appendChild(nameInput);
            playerCardContainer.appendChild(container);
        }

        createPlayerContainer("Player 1");
        createPlayerContainer("Player 2");

        const startButton = document.createElement("button");
        startButton.textContent = "Start";
        startButton.addEventListener("click", setUpGame);

        playerSetupContainer.appendChild(playerCardContainer);
        playerSetupContainer.appendChild(startButton);
    }

    const setUpGame = function() {
        clearAllDisplay();
        // playerSetupContainer.style.display = "none";
        gameBoard.displayBoard();
    }

    const displayEndGame = function() {
        modal.style.display = "flex";

        const endGameDiv = document.createElement("div");
        endGameDiv.classList.add("end-game-menu");

        const message = document.createElement("h2");
        message.textContent = `____ is the winner!`;

        const buttonsContainer = document.createElement("div");

        const restartButton = document.createElement("button");
        restartButton.textContent = "Restart";
        restartButton.addEventListener("click", () => {
            gameFlow.reset();
            setUpGame();
        });

        const mainMenuButton = document.createElement("button");
        mainMenuButton.textContent = "Main Menu";
        mainMenuButton.addEventListener("click", () => {
            gameBoard.hideBoard();
            gameFlow.reset();
            setUpMode();
        });

        buttonsContainer.appendChild(restartButton);
        buttonsContainer.appendChild(mainMenuButton);

        endGameDiv.appendChild(message);
        endGameDiv.appendChild(buttonsContainer);

        modal.appendChild(endGameDiv);
    }

    return { setUpMode, displayEndGame };
})();


// Might delete later
// gameBoard.displayBoard();
UIController.setUpMode();