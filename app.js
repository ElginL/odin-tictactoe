// Modules
const gameBoard = (() => {
    const board = [["", "", ""],
                   ["", "", ""],
                   ["", "", ""]];

    const boardContainer = document.querySelector(".board-container");

    const displayBoard = function() {
        const p1Display = document.getElementById("p1-display");
        const p2Display = document.getElementById("p2-display");
        boardContainer.innerHTML = ``;
        if (p1Display !== null && p2Display !== null) {
            boardContainer.appendChild(p1Display);
            boardContainer.appendChild(p2Display);
        }
        boardContainer.style.display = "grid";
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                // board[row][col] = "";
                const boardItem = document.createElement("div");
                boardItem.classList.add("board-grid-container");
                if (board[row][col] !== "") {
                    boardItem.appendChild(board[row][col]);
                }
                // boardItem.textContent = board[row][col];
                boardItem.setAttribute("row", row);
                boardItem.setAttribute("col", col);
                boardItem.addEventListener("click", gameFlow.playRound);

                boardContainer.appendChild(boardItem);
            }
        }
    }

    const getItemAtRowCol = function(row, col) {
        return board[row][col];
    }

    const emptyBoard = function() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
        boardContainer.innerHTML = ``;
    }

    const markBoard = function(marker, row, col) {
        if (board[row][col] === "") {
            const duplicateMarker = marker.cloneNode(true);
            board[row][col] = duplicateMarker;
            displayBoard();
            return true;
        }
        return false;
    }

    const checkDiagonalWinner = function(marker) {
        marker = marker.getAttribute("alt")
        const topLeftToBotRight = (board[0][0] !== "" && board[0][0].getAttribute("alt") === marker) && 
                                  (board[1][1] !== "" && board[1][1].getAttribute("alt") === marker) && 
                                  (board[2][2] !== "" && board[2][2].getAttribute("alt") === marker);
        const botLeftToTopRight = (board[2][0] !== "" && board[2][0].getAttribute("alt") === marker) && 
                                  (board[1][1] !== "" && board[1][1].getAttribute("alt") === marker) && 
                                  (board[0][2] !== "" && board[0][2].getAttribute("alt") === marker);
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

    return { displayBoard, markBoard, checkDiagonalWinner, emptyBoard, isDraw, getItemAtRowCol };
})();

// Factory Functions
const playerFactory = function() {
    let playerMarker = "";
    let playerName = "";
    let botStatus = false;

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

    const setBot = function() {
        botStatus = true;
    }

    const isBot = function() {
        return botStatus;
    }

    const play = function(e) {
        const row = e.currentTarget.getAttribute("row");
        const col = e.currentTarget.getAttribute("col");

        if (gameBoard.getItemAtRowCol(row, col) === "") {
            rows[parseInt(row)] -= 1;
            cols[parseInt(col)] -= 1;
        }

        gameBoard.markBoard(playerMarker, row, col);
    };

    const botPlay = function() {
        function randInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        let rowIndex = randInt(0, 2);
        let colIndex = randInt(0, 2);

        while (!gameBoard.markBoard(playerMarker, rowIndex, colIndex)) {
            rowIndex = randInt(0, 2);
            colIndex = randInt(0, 2);
        }

        rows[parseInt(rowIndex)] -= 1;
        cols[parseInt(colIndex)] -= 1;
    }

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

    return { play, checkWin, setPlayerName, getPlayerName, resetRowsAndCols, getPlayerMarker, setPlayerMarker, setBot, isBot, botPlay };
}

const bot = (() => {
    const robotAvatar = document.createElement("img");
    robotAvatar.setAttribute("src", "images/robotavatar.png");
    robotAvatar.setAttribute("alt", "robot avatar");

    const getAvatarTag = function() {
        return robotAvatar;
    }

    const getBotName = function() {
        return "Smarty";
    }

    // const play = function() {
    //     function randInt(min, max) {
    //         return Math.floor(Math.random() * (max - min + 1) + min);
    //     }

    //     let rowIndex = randInt(0, 2);
    //     let colIndex = randInt(0, 2);

    //     while (!gameBoard.markBoard(robotAvatar, rowIndex, colIndex)) {
    //         rowIndex = randInt(0, 2);
    //         colIndex = randInt(0, 2);
    //     }
    //     // gameBoard.markBoard(robotAvatar, rowIndex, colIndex);
    // }

    return { getAvatarTag, getBotName };

})();

const gameFlow = (() => {
    let player1 = playerFactory();
    let player2 = playerFactory();

    let currentPlayer = player1;

    const setUpPlayers = function(player1Name, player1Marker, player2Marker, player2Name, isBot=false) {
        player1.setPlayerName(player1Name);
        player1.setPlayerMarker(player1Marker);
        player2.setPlayerName(player2Name);
        player2.setPlayerMarker(player2Marker);
        if (isBot) {
            player2.setBot();
        }
    }

    const getPlayers = function() {
        return [player1, player2];
    }

    const playRound = function(e) {
        currentPlayer.play(e);

        if (!currentPlayer.checkWin() && gameBoard.isDraw()) {
            UIController.displayEndGame(false);
            return;
        };

        currentPlayer = currentPlayer === player1 ? player2 : player1;
        if (currentPlayer.isBot()) {
            currentPlayer.botPlay();
            if (!currentPlayer.checkWin() && gameBoard.isDraw()) {
                UIController.displayEndGame(false);
                return;
            };
            currentPlayer = player1;
        }
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
        createCard("Player vs AI", "pvb.png", setUpPlayerAI);
    };

    const setUpPlayerAI = function() {
        setUpPlayers();

        // Removes player 2 setup box
        playerSetupContainer.firstChild.removeChild(playerSetupContainer.firstChild.lastChild);

        // Reset start button event listener to start a Player Vs AI match
        const button = playerSetupContainer.lastChild.cloneNode(true);
        playerSetupContainer.replaceChild(button, playerSetupContainer.lastChild);
        button.addEventListener("click", () => {
            const playerName = document.querySelector(".player-name").value;
            const avatars = Array.from(document.querySelectorAll(".avatar-img"));
            const playerAvatar = avatars.filter(avatar => avatar.getAttribute("data-status") === "selected")[0];
            const robotAvatar = bot.getAvatarTag();
            if (playerName === "") {
                alert("Player name cannot be empty");
            } else if (playerAvatar === undefined) {
                alert("Player must choose an avatar");
            } else {
                gameFlow.setUpPlayers(playerName, playerAvatar, robotAvatar, bot.getBotName(), true);
                setUpGame();
            }
        })
    }


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
                gameFlow.setUpPlayers(names[0].value, selectedAvatars[0], selectedAvatars[1], names[1].value);
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

        gameBoard.emptyBoard();
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