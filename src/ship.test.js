import { Ship } from "./ship.js";

const ship = new Ship(3);

beforeEach(() => {
    ship.numberOfHits = 0;
    ship.hit();
})

test('hit() increases the number of hits', () => {
    expect(ship.numberOfHits).toBe(1);
});

test('ship should be sunk', () => {
    ship.numberOfHits = 0;
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
})