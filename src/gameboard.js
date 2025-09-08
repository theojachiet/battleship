export class GameBoard {

    constructor() {
        this.rows = 10;
        this.columns = 10;
        this.ships = [];
        this.attacks = [];
        this.board = this.makeBoard();
        this.gameOver = false;
    }

    makeBoard() {
        const board = [];
        for (let i = 0; i < this.rows; i++) {
            board[i] = [];
            for (let j = 0; j < this.columns; j++) {
                board[i].push(new Cell(new Water()));
            }
        }
        return board;
    }

    getBoard() {
        return this.board;
    }

    clearBoard() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.board[i][j].type = new Water();
                this.board[i][j].content = 'water';
            }
        }
    }

    placeShip(ship, row, col) {

        if (row >= this.rows || row < 0 || col >= this.columns || col < 0) throw new Error('Ship out of the board');

        if (!this.spotIsAvailable(ship, row, col)) return false;

        if (ship.orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                // if (this.board[row][col + i].type.content === 'ship') return false;
                this.board[row][col + i].type = ship;
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                // if (this.board[row + i][col].type.content === 'ship') return false;
                this.board[row + i][col].type = ship;
            }
        }

        ship.recordCoordinates(row, col);
        this.ships.push(ship);
        ship.index = this.ships.length - 1;
        return true;
    }

    spotIsAvailable(ship, row, col) {
        console.log(row + ' ' + col)
        console.log(this.board);
        if (ship.orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row][col + i].type.content !== 'water') return false;
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row + i][col].type.content !== 'water') return false;
            }
        }
        return true;
    }

    receiveAttack(row, col) {

        if (this.board[row][col].type.content === 'attacked') {
            console.log('This cell has already been attacked');
            return false;
        }
        if (this.board[row][col].content === 'damagedShip') {
            console.log('This cell has already been attacked');
            return false;
        }

        if (this.board[row][col].type.content === 'water') {
            this.board[row][col].type.hit();
            this.attacks.push([row, col]);
        } else if (this.board[row][col].type.content === 'ship') {

            //changing just the content of the cell but not the type of the entire object
            this.board[row][col].content = 'damagedShip';
            const indexOfShip = this.board[row][col].type.index;
            this.ships[indexOfShip].hit();

            this.attacks.push([row, col]);
        }

        this.checkGameOver();
        return true;
    }

    displayBoard() {
        let boardString = '';
        for (let i = 0; i < this.rows; i++) {
            boardString += '\n';
            for (let j = 0; j < this.columns; j++) {
                boardString += ` [${this.board[i][j].content}] `;
            }
        }
        return boardString;
    }

    checkGameOver() {
        for (let ship of this.ships) {
            if (ship.isSunk() === false) return false;
        }
        this.gameOver = true;
        return true;
    }
}

export class Cell {
    constructor(type) {
        this.type = type;
        this.content = type.content;
    }
}

export class Water {
    constructor() {
        this.content = 'water';
    }

    hit() {
        this.content = 'attacked';
    }
}