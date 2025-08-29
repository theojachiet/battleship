import { Ship } from "./ship.js";

const ship = new Ship(3);

beforeEach(() => {
    ship.numberOfHits = 0;
    ship.hit();
})

test('hit() increases the number of hits', () => {
    expect(ship.numberOfHits).toBe(1);
})