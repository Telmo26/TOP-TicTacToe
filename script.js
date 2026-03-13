const gameboard = (() => {
    let gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    let winner = null;

    function playTurn(x, y, player) {
        if (gameboard[x][y] !== null) { return false; }
        gameboard[x][y] = player;
        return true;
    }

    function isOver() {
        for (let i = 0 ; i < 3 ; i++) {
            if (gameboard[i][0] && gameboard[i][0] === gameboard[i][1] && gameboard[i][1] === gameboard[i][2]) { // This checks the lines
                winner = gameboard[i][0];
                return true; 
            }
            if (gameboard[0][i] && gameboard[0][i] === gameboard[1][i] && gameboard[1][i] === gameboard[2][i]) { // This checks the columns
                winner = gameboard[0][i];
                return true; 
            }
        }
        if (gameboard[0][0] && gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]) { // First diagonal
            winner = gameboard[0][0];
            return true; 
        }
        if (gameboard[0][2] && gameboard[0][2] === gameboard[1][1] && gameboard[1][1] === gameboard[2][0]) { // Second diagonal
            winner = gameboard[0][2];
            return true; 
        }

        if (!gameboard.some((line) => (
            line.some((el) => el === null))
        )) { // If no element in null the game is tied
            winner = 0;
            return true;
        }

        return false;
    }

    function getWinner() {
        return winner
    }

    function getPlayer(x, y) {
        return gameboard[x][y]
    } 

    function reset() {
        gameboard = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        winner = null;
    }

    return {
        playTurn,
        isOver,
        getWinner,
        getPlayer,
        reset
    }
})();

function Player(gameboard, index) {
    if (![1, 2].includes(index)) {
        throw new RangeError("The player indices can only be 1 or 2");
    }

    const board = gameboard;
    const id = index;

    return {
        
    }
}

const player1 = Player(gameboard, 1);
const player2 = Player(gameboard, 2);

const game = ((player1, player2, gameboard) => {
    const p1 = player1;
    const p2 = player2;
    const board = gameboard;

    let turn = true;

    function play(x, y) {
        const allowed = turn ? board.playTurn(x, y, 1) : board.playTurn(x, y, 2);
        if (allowed) turn = !turn;
        return allowed
    }

    function isOver() {
        if (!board.isOver()) return false;
        else {
            return board.getWinner()
        }
    }

    function getTurn() { return turn };

    function reset() {
        turn = true;
        board.reset();
    }

    return {
        play,
        isOver,
        getTurn,
        reset
    }
})(player1, player2, gameboard);

const displayController = ((gameboard) => {
    const board = gameboard;

    function updateSquare(x, y) {
        const id = x + 3*y;
        const button = document.getElementById(id);
        switch (board.getPlayer(x, y)) {
            case 1: 
                button.textContent = "X";
                break;
            case 2: 
                button.textContent = "O";
                break;
            default: 
                button.textContent = "";
                break;
        };
    }

    function updateName(name, player) {
        document.querySelector('#player' + player + '-name').textContent = name;
        document.querySelector(".win-message.player" + player + " > span").textContent = name === "" ? "You win !" : name + " wins !";
    }

    function updateWinMessage() {
        const winner = board.getWinner();
        if (winner === 1) {
            document.querySelector(".win-message.player1").hidden = false;
        } else if (winner === 2) {
            document.querySelector(".win-message.player2").hidden = false;
        }
    }

    function reset() {
        for (let i = 0 ; i < 3 ; i++) {
            for (let j = 0 ; j < 3 ; j++) {
                updateSquare(i, j);
            }
        }
        document.querySelector(".win-message.player1").hidden = true;
        document.querySelector(".win-message.player2").hidden = true;
    }

    return {
        updateSquare,
        updateName,
        updateWinMessage,
        reset
    }
})(gameboard);

const buttons = document.querySelectorAll(".grid > button");
console.log(buttons);
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const id = parseInt(button.id);
        const x = id % 3;
        const y = Math.floor(id / 3);
        
        if(!game.isOver() && game.play(x, y)) {
            displayController.updateSquare(x, y);
        }

        if (game.isOver()) {
            displayController.updateWinMessage();
        }
    })
})

const reset_button = document.querySelector("#reset");
reset_button.addEventListener("click", () => {
    game.reset();
    displayController.reset();
});

const player1_form = document.querySelector(".player1")
player1_form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(player1_form);
    displayController.updateName(formData.get("player1_name"), 1);
})

const player2_form = document.querySelector(".player2")
player2_form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(player2_form);
    displayController.updateName(formData.get("player2_name"), 2);
});