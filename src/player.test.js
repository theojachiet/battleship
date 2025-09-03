import { Player } from "./player.js";

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