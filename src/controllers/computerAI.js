export class ComputerAI {
    constructor(gameboard) {
        this.gameboard = gameboard;
        this.memory = [];
        //Add a mode : if a ship is hit but not sunk, go into targetShip mode, if there is no ship or all the ships are sunk, go into search mode.
    }

    getNextMove() {
        if (this.memory.length === 0) {
            return this.makeRandomMove();
        }

        const previousMove = this.memory[this.memory.length - 1];
        const previousResult = previousMove[2];

        console.log(previousResult);

        if (previousResult.hit === 'ship') {
            if (!previousResult.ship.isSunk()) {
                return this.targetShip(previousMove);
            } else {
                return this.makeRandomMove();
            }
        } else {
            return this.makeRandomMove();
        }
    }

    targetShip(shipCell) {
        const directions = [
            [1, 0],   // down
            [0, 1],   // right
            [-1, 0],  // up
            [0, -1],  // left
        ];

        for (const [dr, dc] of directions) {
            const row = shipCell[0] + dr;
            const col = shipCell[1] + dc;

            if (!this.checkMoveAlreadyMade(row, col)) {
                return { row, col };
            }
        }

        return { row, col };
    }

    makeRandomMove() {
        let row = Math.floor(Math.random() * 10);
        let col = Math.floor(Math.random() * 10);

        while (this.checkMoveAlreadyMade(row, col)) {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
        }

        return { row, col };
    }

    checkMoveAlreadyMade(row, col) {

        for (let i = 0; i < this.memory.length; i++) {
            if (this.memory[i][0] === row && this.memory[i][1] === col) {
                return true;
            }
        }

        return false;
    } s

    registerHit(row, col, result) {
        this.memory.push([row, col, result]);
    }
}