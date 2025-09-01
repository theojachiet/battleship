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

//PLACING SHIPS

test('placing a 1 long ship on the board returns a ship cell', () => {
    const ship = new Ship(1);
    gameboard.placeShip(ship, 0, 0);
    gameboard.placeShip(ship, 0, 1);
    gameboard.placeShip(ship, 2, 0);
    expect(board[0][0].type).toBe('ship');
    expect(board[0][1].type).toBe('ship');
    expect(board[2][0].type).toBe('ship');
});

test('placing a 2 or 3 long ship returns as many ship cells, horizontally', () => {
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
    expect(board[2][6].type).toBe('ship');
});

test('ship orientation returns the asssociated value', () => {
    const horizontalShip1 = new Ship(1);
    const horizontalShip2 = new Ship(1, 'horizontal');
    const verticalShip = new Ship(1, 'vertical');
    expect(horizontalShip1.orientation).toBe('horizontal');
    expect(horizontalShip2.orientation).toBe('horizontal');
    expect(verticalShip.orientation).toBe('vertical');
})

test('placing a 2 or 3 long ship returns as many ship cells, vertically', () => {
    const ship = new Ship(2, 'vertical');
    const ship3 = new Ship(3, 'vertical');
    gameboard.placeShip(ship, 0, 0);
    gameboard.placeShip(ship, 1, 1);
    gameboard.placeShip(ship3, 2, 4);
    expect(board[0][0].type).toBe('ship');
    expect(board[1][0].type).toBe('ship');

    expect(board[1][1].type).toBe('ship');
    expect(board[2][1].type).toBe('ship');
    
    expect(board[2][4].type).toBe('ship');
    expect(board[3][4].type).toBe('ship');
    expect(board[4][4].type).toBe('ship');
});

//PLACING SHIPS EDGE CASES

test('placing a ship outside the board returns an error', () => {
    const ship = new Ship(1);
    expect(() => gameboard.placeShip(ship, 1, 10)).toThrow(Error);
    expect(() => gameboard.placeShip(ship, -1, 0)).toThrow(Error);
});

test('placing a long ship starting inside the board and passing it returns an error', () => {
    const horizontalShip = new Ship(3);
    const verticalShip = new Ship(3, 'vertical');
    expect(() => gameboard.placeShip(horizontalShip, 1, 8)).toThrow(Error);
    expect(() => gameboard.placeShip(verticalShip, 8, 2)).toThrow(Error);
});