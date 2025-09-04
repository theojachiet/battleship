import './reset.css';
import './general.css';

import { Player } from './player.js';
import { displayBoard } from './DOM.js';
import { Ship } from './ship.js';

const player = new Player('human');
const computer = new Player('computer');

placeShips(player);
placeShips(computer);

displayBoard(player);
displayBoard(computer);

function placeShips(player) {
    const ship1 = new Ship(1);
    const ship2 = new Ship(1);
    const ship3 = new Ship(1);
    const ship4 = new Ship(1);

    const ship5 = new Ship(2);
    const ship6 = new Ship(2);
    const ship7 = new Ship(2, 'vertical');

    const ship8 = new Ship(3);
    const ship9 = new Ship(3, 'vertical');
    
    const ship10 = new Ship(4, 'vertical');

    player.gameboard.placeShip(ship1, 4, 0);
    player.gameboard.placeShip(ship2, 3, 3);
    player.gameboard.placeShip(ship3, 7, 1);
    player.gameboard.placeShip(ship4, 5, 8);

    player.gameboard.placeShip(ship5, 5, 2);
    player.gameboard.placeShip(ship6, 8, 8);
    player.gameboard.placeShip(ship7, 1, 5);

    player.gameboard.placeShip(ship8, 1, 1);
    player.gameboard.placeShip(ship9, 1, 9);

    player.gameboard.placeShip(ship10, 5, 5);
}