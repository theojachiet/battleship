export class Ship {

    constructor(length, orientation = 'horizontal') {
        this.length = length;
        this.numberOfHits = 0;
        this.sunk = false;
        this.orientation = orientation;
        this.content = 'ship';
        this.index = 0;
        this.coordinates = [];
    }

    hit() {
        this.numberOfHits++;
        if (this.isSunk()) this.sunk = true;
    }

    isSunk() {
        if (this.numberOfHits >= this.length) return true;
        return false;
    }

    recordCoordinates(row, col) {
        if (this.orientation === 'vertical') {
            for (let i = 0; i < this.length; i++) {
                this.coordinates.push([row + i, col]);
            }
        } else {
            for (let i = 0; i < this.length; i++) {
                this.coordinates.push([row, col + i]);
            }
        }
    }
}