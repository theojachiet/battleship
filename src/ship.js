export class Ship {

    constructor(length) {
        this.length = length;
        this.numberOfHits = 0;
        this.sunk = false;
    }

    hit() {
        this.numberOfHits++;
    }
}