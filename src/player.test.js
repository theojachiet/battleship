import { Player } from "./player.js";
import { Ship } from "./ship.js";

const player = new Player('human');
const computer = new Player('computer');

test('there is a human and a computer player', () => {
    expect(player.type).toBe('human');
    expect(computer.type).toBe('computer');
});

test('test that the gameboard is made for the two players', () => {
    expect(player.gameboard.getBoard()[0][0].content).toBe('water');
    expect(computer.gameboard.getBoard()[0][0].content).toBe('water');
});

test('each gameboard is independant', () => {
    const ship = new Ship(1);
    
    player.gameboard.placeShip(ship, 0, 0);
    computer.gameboard.placeShip(ship, 0, 1);

    expect(player.gameboard.getBoard()[0][0].type.content).toBe('ship');
    expect(player.gameboard.getBoard()[0][1].type.content).toBe('water');

    expect(computer.gameboard.getBoard()[0][0].type.content).toBe('water');
    expect(computer.gameboard.getBoard()[0][1].type.content).toBe('ship');

})