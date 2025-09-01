export class Ship {

    constructor(length, orientation = 'horizontal') {
        this.length = length;
        this.numberOfHits = 0;
        this.sunk = false;
        this.orientation = orientation;
    }

    hit() {
        this.numberOfHits++;
    }

    isSunk() {
        if (this.numberOfHits >= this.length) return true;
        return false;
    }
}