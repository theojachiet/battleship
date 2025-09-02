export class GameBoard {

    constructor() {
        this.rows = 10;
        this.columns = 10;
        this.board = this.makeBoard();
    }

    makeBoard() {
        const board = [];
        for (let i = 0; i < this.rows; i++) {
            board[i] = [];
            for (let j = 0; j < this.columns; j++) {
                board[i].push(new Cell('water'));
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
                this.board[i][j].type = 'water';
            }
        }
    }

    placeShip(ship, row, col) {
        if (row >= this.rows || row < 0 || col >= this.columns || col < 0) throw new Error('Ship out of the board');

        if (!this.spotIsAvailable(ship, row, col)) throw new Error('Spot is not clear');

        if (ship.orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row][col + i].type === 'ship') throw new Error('A ship is already placed here');
                this.board[row][col + i].type = 'ship';
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row + i][col].type === 'ship') throw new Error('A ship is already placed here');
                this.board[row + i][col].type = 'ship';
            }
        }
    }

    spotIsAvailable(ship, row, col) {
        if (ship.orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row][col + i].type !== 'water') return false;
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row + i][col].type !== 'water') return false;
            }
        }
        return true;
    }

    receiveAttack(row, col) {
        if (this.board[row][col].type === 'attacked') throw new Error('This cell has already been attacked');
        this.board[row][col].type = 'attacked';
    }
}

export class Cell {
    constructor(type) {
        this.type = type;
    }
}