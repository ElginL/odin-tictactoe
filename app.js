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

    const emptyBoard = function() {
        boardContainer.innerHTML = ``;
    }

    const markBoard = function(marker, e) {
        const row = e.target.getAttribute("row");
        const col = e.target.getAttribute("col");
        if (board[row][col] === "") {
            const duplicateMarker = marker.cloneNode(true);
            e.target.appendChild(duplicateMarker);
            board[row][col] = marker;
        }
    }

    const checkDiagonalWinner = function(marker) {
        const topLeftToBotRight = board[0][0] === marker && board[1][1] === marker && board[2][2] === marker;
        const botLeftToTopRight = board[2][0] === marker && board[1][1] === marker && board[0][2] === marker;
        return topLeftToBotRight || botLeftToTopRight;
    }

    const isDraw = function() {
        let filledCount = 0;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] !== "") {
                    filledCount++;
                }
            }
        }
        return filledCount === 9;
    }

    return { displayBoard, markBoard, checkDiagonalWinner, emptyBoard, isDraw };
})();

// Factory Functions
const playerFactory = function() {
    let playerMarker = "";
    let playerName = "";

    const rows = [3, 3, 3];
    const cols = [3, 3, 3];

    const setPlayerName = function(name) {
        playerName = name;
    }

    const getPlayerName = function() {
        return playerName;
    }

    const setPlayerMarker = function(marker) {
        marker.style.cssText = "";
        playerMarker = marker;
    }

    const getPlayerMarker = function() {
        return playerMarker;
    }

    const play = function(e) {
        if (e.target.textContent === "") {
            rows[e.target.getAttribute("row")] -= 1;
            cols[e.target.getAttribute("col")] -= 1;
        }
        gameBoard.markBoard(playerMarker, e);
    };

    const resetRowsAndCols = function() {
        for (let i = 0; i < 3; i++) {
            rows[i] = 3;
            cols[i] = 3;
        }
    }

    const checkWin = function() {
        for (let i = 0; i < 3; i++) {
            if (rows[i] === 0 || cols[i] === 0 || gameBoard.checkDiagonalWinner(playerMarker)) {
                UIController.displayEndGame(true, playerName);
                return true;
            }
        }
        return false;
    };

    return { play, checkWin, setPlayerName, getPlayerName, resetRowsAndCols, getPlayerMarker, setPlayerMarker };
}

const gameFlow = (() => {
    let player1 = playerFactory();
    let player2 = playerFactory();

    let currentPlayer = player1;

    const setUpPlayers = function(player1Name, player2Name, player1Marker, player2Marker) {
        player1.setPlayerName(player1Name);
        player1.setPlayerMarker(player1Marker);
        player2.setPlayerName(player2Name);
        player2.setPlayerMarker(player2Marker);
    }

    const getPlayers = function() {
        return [player1, player2];
    }

    const playRound = function(e) {
        currentPlayer.play(e);

        if (!currentPlayer.checkWin() && gameBoard.isDraw()) {
            UIController.displayEndGame(false);
        };
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const reset = function() {
        player1.resetRowsAndCols();
        player2.resetRowsAndCols();
        currentPlayer = player1;
    }

    return { playRound, reset, setUpPlayers, getPlayers };
})();

const UIController = (() => {
    const modesContainer = document.querySelector(".mode-selection-container");
    const playerSetupContainer = document.querySelector(".player-setup-container");
    const modal = document.querySelector(".modal");
    const boardContainer = document.querySelector(".board-container");

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

        const createPlayerContainer = function(playerIndex) {
            function createImg(src, alt) {
                const img = document.createElement("img");
                img.setAttribute("src", src);
                img.setAttribute("alt", alt);
                img.setAttribute("class", "avatar-img");
                img.setAttribute("data-status", "not selected");
                img.addEventListener("click", e => {
                    characterSelectionContainer.childNodes.forEach(node => {
                        node.style.cssText = "";
                        node.setAttribute("data-status", "not selected");
                    })
                    e.target.style.border = "2px solid yellow";
                    e.target.style.boxShadow = "2px 2px 10px yellow";
                    e.target.setAttribute("data-status", "selected");
                });
                characterSelectionContainer.appendChild(img);
            }

            const container = document.createElement("div");
            container.classList.add("player-container");

            const header = document.createElement("h2");
            header.textContent = playerIndex;

            const nameInput = document.createElement("input");
            nameInput.setAttribute("placeholder", "Enter your name");
            nameInput.classList.add("player-name");

            const selectAvatarTxt = document.createElement("p");
            selectAvatarTxt.textContent = "Select Your Avatar";

            const characterSelectionContainer = document.createElement("div");
            characterSelectionContainer.classList.add("char-select-container");
            createImg("images/elf.png", "elf character");
            createImg("images/penguin.png", "penguin character");
            createImg("images/snowman.png", "snowman character");
        
            container.appendChild(header);
            container.appendChild(nameInput);
            container.appendChild(selectAvatarTxt);
            container.appendChild(characterSelectionContainer);
            playerCardContainer.appendChild(container);
        }

        createPlayerContainer("Player 1");
        createPlayerContainer("Player 2");

        const startButton = document.createElement("button");
        startButton.textContent = "Start";
        startButton.addEventListener("click", () => {
            const names = document.querySelectorAll(".player-name");
            const avatars = Array.from(document.querySelectorAll(".avatar-img"));
            const selectedAvatars = avatars.filter(avatar => avatar.getAttribute("data-status") === "selected");
            if (names[0].value.length === 0 || names[1].value.length === 0) {
                alert("Name cannot be empty!");
            } else if (names[0].value.length >= 10 || names[1].value.length >= 10) {
                alert("Names cannot have greater than length 9");
            } else if (selectedAvatars.length !== 2) {
                alert("Each player must select an avatar");
            } else if (selectedAvatars[0].getAttribute("alt") === selectedAvatars[1].getAttribute("alt")) {
                alert("Players must select unique avatars")
            } else {
                gameFlow.setUpPlayers(names[0].value, names[1].value, selectedAvatars[0], selectedAvatars[1]);
                setUpGame();
            }
        });

        playerSetupContainer.appendChild(playerCardContainer);
        playerSetupContainer.appendChild(startButton);
    }

    const setUpGame = function() {
        clearAllDisplay();

        const [player1, player2] = gameFlow.getPlayers();
        

        const createPlayerDisplay = function(playerObj, index) {
            const playerDescriptionContainer = document.createElement("div");
            playerDescriptionContainer.id = `p${index}-display`;
            const playerName = document.createElement("h2");
            playerName.textContent = playerObj.getPlayerName() + " : ";
            playerName.appendChild(playerObj.getPlayerMarker());
            playerDescriptionContainer.appendChild(playerName);
            boardContainer.insertBefore(playerDescriptionContainer  , boardContainer.firstChild);
        }

        gameBoard.displayBoard();
        
        createPlayerDisplay(player1, 1);
        createPlayerDisplay(player2, 2);
    }

    const displayEndGame = function(hasWinner, playerName="") {
        modal.style.display = "flex";

        const endGameDiv = document.createElement("div");
        endGameDiv.classList.add("end-game-menu");

        const message = document.createElement("h2");
        if (hasWinner) {
            message.textContent = `${playerName} is the winner!`;
        } else {
            message.textContent = "Draw!";
        }

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
            gameBoard.emptyBoard();
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