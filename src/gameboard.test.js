import { GameBoard } from "./gameboard.js";

const gameboard = new GameBoard();

test('gameboard is a 10 by 10 grid', () => {
    expect(gameboard.rows).toBe(10);
    expect(gameboard.columns).toBe(10);
});

test('testing the value of a cell returns either water, ship or damaged', () => {
    const board = gameboard.getBoard();
    expect(board[0][0]).toBe('water' || 'ship' || 'damaged');
})

//each cell can be 1: water 2: a ship 3: a damaged ship

