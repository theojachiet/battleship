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

    clearSpot(row, col) {
        this.board[row][col].type = new Water();
        this.board[row][col].content = 'water';
    }

    replaceShip(ship, row, col) {
        ship.content = 'ship';
        this.board[row][col].type = ship;
        // ship.recordCoordinates(row, col);
    }

    placeShip(ship, row, col) {

        if (row >= this.rows || row < 0 || col >= this.columns || col < 0) throw new Error('Ship out of the board');

        if (!this.spotIsAvailable(ship, row, col)) return false;
        if (!this.spotIsSeparatedFromOthers(ship, row, col)) return false;

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
        if (ship.orientation === 'horizontal') {
            if (col + ship.length >= this.columns) return false;
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row][col + i].type.content !== 'water') return false;
            }
        } else {
            if (row + ship.length >= this.rows) return false;
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row + i][col].type.content !== 'water') return false;
            }
        }
        return true;
    }

    spotIsSeparatedFromOthers(ship, row, col) {
        let length = ship.length;
        let orientation = ship.orientation;

        // Calculate ship's bounding box
        let rowStart = row;
        let rowEnd = row;
        let colStart = col;
        let colEnd = col;

        if (orientation === 'horizontal') {
            colEnd = col + length - 1;
        } else {
            rowEnd = row + length - 1;
        }

        // Expand the bounding box by 1 in all directions
        let minRow = Math.max(0, rowStart - 1);
        let maxRow = Math.min(this.rows - 1, rowEnd + 1);
        let minCol = Math.max(0, colStart - 1);
        let maxCol = Math.min(this.columns - 1, colEnd + 1);

        // Check the bounding box for non-water
        for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
                // Skip the ship's own cells (optional if they're not placed yet)
                if (orientation === 'horizontal' && r === row && c >= col && c <= colEnd) continue;
                if (orientation === 'vertical' && c === col && r >= row && r <= rowEnd) continue;

                if (this.board[r][c].type.content !== 'water') {
                    return false;
                }
            }
        }

        return true;
    }

    receiveAttack(row, col) {

        if (this.board[row][col].type.content === 'attacked') {
            return false;
        }
        if (this.board[row][col].content === 'damagedShip') {
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

    getShip(row, col) {
        if (this.board[row][col].type.content !== 'ship') return false;
        const indexOfShip = this.board[row][col].type.index;
        const ship = this.ships[indexOfShip];
        return ship;
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
            if (!ship.isSunk()) return false;
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