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

    placeShip(ship, row, col) {
        if (row >= this.rows || row < 0 || col >= this.columns || col < 0) throw new Error('Ship out of the board');

        if (ship.orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                this.board[row][col + i].type = 'ship';
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                this.board[row + i][col].type = 'ship';
            }
        }
    }
}

export class Cell {
    constructor(type) {
        this.type = type;
    }
}