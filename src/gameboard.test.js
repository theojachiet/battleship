import { GameBoard } from "./gameboard.js";
import { Ship } from "./ship.js";

const gameboard = new GameBoard();
const board = gameboard.getBoard();

test('gameboard is a 10 by 10 grid', () => {
    expect(gameboard.rows).toBe(10);
    expect(gameboard.columns).toBe(10);
});

test('testing the value of a cell returns either water, ship or damaged', () => {
    expect(board[0][0].type).toBe('water' || 'ship' || 'damaged');
});

test('placing a 1 long ship on the board returns a ship cell', () => {
    const ship = new Ship(1);
    gameboard.placeShip(ship, 0, 0);
    gameboard.placeShip(ship, 0, 1);
    gameboard.placeShip(ship, 2, 0);
    expect(board[0][0].type).toBe('ship');
    expect(board[0][1].type).toBe('ship');
    expect(board[2][0].type).toBe('ship');
});

test('placing a 2 long ship returns as many ship cells, horizontally', () => {
    const ship = new Ship(2);
    const ship3 = new Ship(3);
    gameboard.placeShip(ship, 0, 0);
    gameboard.placeShip(ship, 1, 1);
    gameboard.placeShip(ship3, 2, 4);
    expect(board[0][0].type).toBe('ship');
    expect(board[0][1].type).toBe('ship');

    expect(board[1][1].type).toBe('ship');
    expect(board[1][2].type).toBe('ship');
    
    expect(board[2][4].type).toBe('ship');
    expect(board[2][5].type).toBe('ship');
});