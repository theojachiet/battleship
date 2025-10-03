import { Ship } from "../models/ship";

export function placeRandomShips(player) {
    const ship1 = new Ship(1);
    const ship2 = new Ship(1);
    const ship3 = new Ship(1);
    const ship4 = new Ship(1);

    let ship5
    randomOrientation() ? ship5 = new Ship(2) : ship5 = new Ship(2, 'vertical');
    let ship6
    randomOrientation() ? ship6 = new Ship(2) : ship6 = new Ship(2, 'vertical');
    let ship7
    randomOrientation() ? ship7 = new Ship(2) : ship7 = new Ship(2, 'vertical');

    let ship8
    randomOrientation() ? ship8 = new Ship(3) : ship8 = new Ship(3, 'vertical');
    let ship9
    randomOrientation() ? ship9 = new Ship(3) : ship9 = new Ship(3, 'vertical');

    let ship10
    randomOrientation() ? ship10 = new Ship(4) : ship10 = new Ship(4, 'vertical');

    function randomOrientation() {
        return Math.random() > 0.5;
    }

    let ships = [ship10, ship9, ship8, ship7, ship6, ship5, ship4, ship3, ship2, ship1];

    for (let ship of ships) {
        let row = Math.floor(Math.random() * 10);
        let col = Math.floor(Math.random() * 10);

        let shipIsPlaced = player.gameboard.placeShip(ship, row, col);

        while (!shipIsPlaced) {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            shipIsPlaced = player.gameboard.placeShip(ship, row, col);
        }
    }
}