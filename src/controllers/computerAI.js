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
                this.submode = 'orientation';
                const orientation = this.getShipOrientation(this.storedShip, previousMove);
                const direction = this.getShipDirection(this.storedShip, previousMove, orientation);
                console.log(direction);
                return this.makeRandomMove()
                //If previous move succeded to find another ship, determine its orientation, direction and change the submode
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

    getShipOrientation(storedShip, previousMove) {
        //checking if both rows are the same
        if (storedShip[0] === previousMove[0]) return 'horizontal';
        else return 'vertical';
    }

    getShipDirection(storedShip, previousMove, orientation) {
        if (orientation === 'horizontal') {

            const rightCell = (storedShip[1] > previousMove[1]) ? storedShip : previousMove;
            const leftCell = (storedShip[1] < previousMove[1]) ? storedShip : previousMove;

            //Check on both sides of the cells if the ship stops somewhere
            if (this.checkMoveAlreadyMade(rightCell[0], rightCell[1] + 1)) return 'left';
            else if (this.checkMoveAlreadyMade(leftCell[0], leftCell[1] - 1)) return 'right';
            else return null;

        } else {
            const topCell = (storedShip[0] < previousMove[0]) ? storedShip : previousMove;
            const bottomCell = (storedShip[0] > previousMove[0]) ? storedShip : previousMove;

            //Check on both sides of the cells if the ship stops somewhere
            if (this.checkMoveAlreadyMade(topCell[0] - 1, topCell[1])) return 'down';
            else if (this.checkMoveAlreadyMade(bottomCell[0] + 1, bottomCell[1])) return 'up';
            else return null;
        }
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