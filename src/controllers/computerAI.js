export class ComputerAI {
    constructor(gameboard) {
        this.gameboard = gameboard;
        this.memory = [];
        this.mode = 'random';
        this.storedShip = null;
        this.submode = 'directionLess';
        //Add a mode : if a ship is hit but not sunk, go into targetShip mode, if there is no ship or all the ships are sunk, go into search mode.
    }

    getNextMove() {
        //First move case
        if (this.memory.length === 0) {
            return this.makeRandomMove();
        }

        //Return to random mode if all the ships on the board are sunk
        if (this.checkAllShipsSunk()) {
            this.mode = 'random';
        } else {
            this.mode = 'target';
        }

        console.log(this.mode);

        if (this.mode === 'random') {
            return this.makeRandomMove();
        } else if (this.mode === 'target') {
            const previousMove = this.memory[this.memory.length - 1];
            const previousResult = previousMove[2];

            if (previousMove[0] === this.storedShip[0] && previousMove[1] === this.storedShip[1]) {
                this.storedShip = previousMove;
                return this.targetShip(previousMove);
                //If previous move was hitting the ship => try around
            } else if (previousResult.hit !== 'ship') {
                return this.targetShip(this.storedShip);
                //If previous move was a failed attempt to find another part of the ship => try again
            } else if (previousResult.hit === 'ship') {
                this.submode = 'direction';
                console.log('direction');
                return this.makeRandomMove();
                //If previous move succeded to find another ship, determine its direction and change the submode
            } else {
                return this.makeRandomMove();
            }
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

    checkAllShipsSunk() {
        for (let target of this.memory) {
            if (target[2].hit === 'ship') {
                if (target[2].ship.sunk === false) {
                    this.storedShip = target;
                    return false;
                }
            }
        }

        return true;
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