import { GameBoard } from "./gameboard.js";
import { Ship } from "./ship.js";

const gameboard = new GameBoard();
const board = gameboard.getBoard();

beforeEach(() => {
    gameboard.clearBoard();
    gameboard.ships = [];
    gameboard.attacks = [];
})

test('gameboard is a 10 by 10 grid', () => {
    expect(gameboard.rows).toBe(10);
    expect(gameboard.columns).toBe(10);
});

test('testing the value of a cell returns either water, ship, damagedShip or attacked', () => {
    expect(board[0][0].type.content).toBe('water' || 'ship' || 'damagedShip' || 'attacked');
});

//PLACING SHIPS

test('placing a 1 long ship on the board returns a ship cell', () => {
    const ship = new Ship(1);
    gameboard.placeShip(ship, 0, 0);
    gameboard.placeShip(ship, 0, 1);
    gameboard.placeShip(ship, 2, 0);

    expect(board[0][0].type.content).toBe('ship');
    expect(board[0][1].type.content).toBe('ship');
    expect(board[2][0].type.content).toBe('ship');
});

test('placing a 2 or 3 long ship returns as many ship cells, horizontally', () => {
    const ship = new Ship(2);
    const ship3 = new Ship(3);
    gameboard.placeShip(ship, 0, 0);
    gameboard.placeShip(ship, 1, 1);
    gameboard.placeShip(ship3, 2, 4);
    expect(board[0][0].type.content).toBe('ship');
    expect(board[0][1].type.content).toBe('ship');

    expect(board[1][1].type.content).toBe('ship');
    expect(board[1][2].type.content).toBe('ship');
    
    expect(board[2][4].type.content).toBe('ship');
    expect(board[2][5].type.content).toBe('ship');
    expect(board[2][6].type.content).toBe('ship');
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
    expect(board[0][0].type.content).toBe('ship');
    expect(board[1][0].type.content).toBe('ship');

    expect(board[1][1].type.content).toBe('ship');
    expect(board[2][1].type.content).toBe('ship');
    
    expect(board[2][4].type.content).toBe('ship');
    expect(board[3][4].type.content).toBe('ship');
    expect(board[4][4].type.content).toBe('ship');
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

test('placing 2 simple ships at the same place returns an error', () => {
    const ship1 = new Ship(1);
    const ship2 = new Ship(1);
    gameboard.placeShip(ship1, 0, 0);
    expect(() => gameboard.placeShip(ship2, 0, 0)).toThrow(Error);
});

test('placing 2 big ships that have a common point returns an error for the second ship', () => {
    const ship1 = new Ship(3);
    const ship2 = new Ship(3, 'vertical');
    gameboard.placeShip(ship1, 0, 1);
    expect(() => gameboard.placeShip(ship2, 1, 0)).not.toThrow(Error);
    expect(() => gameboard.placeShip(ship2, 0, 2)).toThrow(Error);
    expect(() => gameboard.placeShip(ship2, 3, 5)).not.toThrow(Error);
});

//ATTACK

test('attacking a water cell returns an attacked cell', () => {
    gameboard.receiveAttack(0, 0);
    expect(board[0][0].type.content).toBe('attacked');
});

test('prevent attack on already attacked cells', () => {
    gameboard.receiveAttack(0, 0);
    expect(() => gameboard.receiveAttack(0, 0)).toThrow(Error);
    expect(() => gameboard.receiveAttack(0, 1)).not.toThrow(Error);
});

test('attacking a ship cell returns a damagedShip cell', () => {
    const ship = new Ship(2);
    gameboard.placeShip(ship, 0, 0);
    gameboard.receiveAttack(0, 1);
    expect(board[0][1].content).toBe('damagedShip');
});

test('attacking a damaged ship cell returns an error', () => {
    const ship = new Ship(2);
    gameboard.placeShip(ship, 0, 0);
    gameboard.receiveAttack(0, 1);
    console.log(gameboard.attacks);
    
    expect(() => gameboard.receiveAttack(0, 1)).toThrow(Error);
});

test('index of ship can be found on the board cells', () => {
    const ship = new Ship(2);
    const ship2 = new Ship(3);
    gameboard.placeShip(ship, 0, 0);
    gameboard.placeShip(ship2, 2, 2);

    expect(gameboard.ships[0].index).toBe(0);
    expect(board[0][1].type.index).toBe(0);
    expect(board[2][4].type.index).toBe(1);
});

test('attacking a ship sends an attack to the ship object', () => {
    const ship = new Ship(2);
    gameboard.placeShip(ship, 0, 0);
    expect(ship.numberOfHits).toBe(0);
    gameboard.receiveAttack(0, 1);
    expect(ship.numberOfHits).toBe(1);
});

test('attacks are beeing recorded to an array', () => {
    const ship = new Ship(2);
    gameboard.placeShip(ship, 0, 0);
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(3, 3);
    gameboard.receiveAttack(2, 5);
    expect(gameboard.attacks).toEqual([[0, 0], [3, 3], [2, 5]]);
});