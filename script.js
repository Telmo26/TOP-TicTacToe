const gameBoard = new class {
    #gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    #winner = null;

    playTurn(x, y, player) {
        if (this.#gameboard[x][y] !== null) { return false; }
        this.#gameboard[x][y] = player;
        return true;
    }

    isOver() {
        for (let i = 0 ; i < 3 ; i++) {
            if (this.#gameboard[i][0] && this.#gameboard[i][0] === this.#gameboard[i][1] && this.#gameboard[i][1] === this.#gameboard[i][2]) { // This checks the lines
                this.#winner = this.#gameboard[i][0];
                return true; 
            }
            if (this.#gameboard[0][i] && this.#gameboard[0][i] === this.#gameboard[1][i] && this.#gameboard[1][i] === this.#gameboard[2][i]) { // This checks the columns
                this.#winner = this.#gameboard[0][i];
                return true; 
            }
        }
        if (this.#gameboard[0][0] && this.#gameboard[0][0] === this.#gameboard[1][1] && this.#gameboard[1][1] === this.#gameboard[2][2]) { // First diagonal
            this.#winner = this.#gameboard[0][0];
            return true; 
        }
        if (this.#gameboard[0][2] && this.#gameboard[0][2] === this.#gameboard[1][1] && this.#gameboard[1][1] === this.#gameboard[2][0]) { // Second diagonal
            this.#winner = this.#gameboard[0][2];
            return true; 
        }

        if (!this.#gameboard.some((line) => (
            line.some((el) => el === null))
        )) { // If no element in null the game is tied
            this.#winner = 0;
            return true;
        }

        return false;
    }

    get winner() {
        return this.#winner
    }

    getPlayer(x, y) {
        return this.#gameboard[x][y]
    } 

    reset() {
        this.#gameboard = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        this.#winner = null;
    }
}

class Player {
    #board;
    #index;
    constructor(gameboard, index) {
        if (![1, 2].includes(index)) {
            throw new RangeError("The player indices can only be 1 or 2");
        }

        this.#board = gameboard;
        this.#index = index;
    } 
}

const player1 = new Player(gameBoard, 1);
const player2 = new Player(gameBoard, 2);

const game = new class {
    #p1;
    #p2;
    #board;
    #turn = true;

    constructor(player1, player2, gameboard) {
        this.#p1 = player1;
        this.#p2 = player2;
        this.#board = gameboard;
    }

    play(x, y) {
        const allowed = this.#turn ? this.#board.playTurn(x, y, 1) : this.#board.playTurn(x, y, 2);
        if (allowed) this.#turn = !this.#turn;
        return allowed
    }

    isOver() {
        if (!this.#board.isOver()) return false;
        else {
            return this.#board.winner
        }
    }

    get turn() { return this.#turn };

    reset() {
        this.#turn = true;
        this.#board.reset();
    }
}(player1, player2, gameBoard);

const displayController = new class {
    #board;

    constructor(gameboard) {
        this.#board = gameboard;
    }

    updateSquare(x, y) {
        const id = x + 3*y;
        const button = document.getElementById(id);
        switch (this.#board.getPlayer(x, y)) {
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

    updateName(name, player) {
        document.querySelector('#player' + player + '-name').textContent = name;
        document.querySelector(".win-message.player" + player + " > span").textContent = name === "" ? "You win !" : name + " wins !";
    }

    updateWinMessage() {
        const winner = this.#board.winner;
        if (winner === 1) {
            document.querySelector(".win-message.player1").hidden = false;
        } else if (winner === 2) {
            document.querySelector(".win-message.player2").hidden = false;
        }
    }

    reset() {
        for (let i = 0 ; i < 3 ; i++) {
            for (let j = 0 ; j < 3 ; j++) {
                this.updateSquare(i, j);
            }
        }
        document.querySelector(".win-message.player1").hidden = true;
        document.querySelector(".win-message.player2").hidden = true;
    }
}(gameBoard);

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