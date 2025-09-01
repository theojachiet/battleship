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

}

export class Cell {
    constructor(type) {
        this.type = type;
    }
}