import './reset.css';
import './general.css';

import { Player } from './player.js';
import { displayBoard, removeShip, renderNewShip, updateBoard } from './DOM.js';
import { Ship } from './ship.js';

const container = document.querySelector('.container');

function placeRandomShips(player) {
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

class GameFlow {

    constructor(players) {
        this.players = players;

        this.human = players[0];
        this.computer = players[1];

        this.currentPlayer = this.human;
        this.otherPlayer = this.computer;
    }

    addTurn() {
        if (this.currentPlayer === this.human) {
            this.currentPlayer = this.computer;
            this.otherPlayer = this.human;
        }
        else {
            this.currentPlayer = this.human;
            this.otherPlayer = this.computer;
        }
    }

    playRound(row, col) {
        let attackisValid = this.otherPlayer.gameboard.receiveAttack(row, col);

        if (attackisValid) {
            if (this.currentPlayer.gameboard.gameOver) {
                alert(`Game Over ! ${this.otherPlayer.type} won !`);
            }
            this.addTurn();
            return true;
        } else return false;

    }
}

function screenController() {
    const player = new Player('human');
    const computer = new Player('computer');
    const players = [player, computer];

    const game = new GameFlow(players);

    const randomizeAndRender = () => {
        player.gameboard.clearBoard();
        computer.gameboard.clearBoard();

        placeRandomShips(player);
        placeRandomShips(computer);

        container.textContent = '';

        displayBoard(player);
        displayBoard(computer);

        const boards = document.querySelectorAll('.board');
        const computerBoard = boards[1];
        computerBoard.addEventListener('click', eventHandler);
    }

    randomizeAndRender();

    const boards = document.querySelectorAll('.board');
    const playerBoard = boards[0];
    playerBoard.addEventListener('dragstart', dragStartHandler);
    playerBoard.addEventListener('dragover', dragOverHandler);
    playerBoard.addEventListener('drop', dropHandler);

    const randomizeButton = document.querySelector('button.randomize');
    randomizeButton.addEventListener('click', randomizeAndRender);



    function eventHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.column;

        if (!selectedCol || !selectedRow) return;

        //Play the round and update the board (to the current player because it was changed in the playround function)
        let roundisPlayed = game.playRound(selectedRow, selectedCol);

        if (roundisPlayed) {
            updateBoard(game.currentPlayer, selectedRow, selectedCol);

            //Computer plays
            const computerAttackCoordinates = computerPlays();
            updateBoard(game.currentPlayer, computerAttackCoordinates[0], computerAttackCoordinates[1]);
        }
    }

    function dragStartHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.column;
        const type = e.target.dataset.type;

        if (!selectedCol || !selectedRow) return;
        if (type !== 'ship') return;

        const ship = player.gameboard.getShip(selectedRow, selectedCol);
        const shipCoordinates = ship.coordinates;
        const shipIndex = ship.index;
        const orientation = ship.orientation;

        //Getting the ship length and the position that the ship was selected
        let indexOfSelectedCell = 0;
        for (let i = 0; i < shipCoordinates.length; i++) {
            if (shipCoordinates[i][0] == selectedRow && shipCoordinates[i][1] == selectedCol) indexOfSelectedCell = i;
        }

        let shipCells = [];

        for (let cell of shipCoordinates) {
            const targetedCell = document.querySelector(`[data-column="${cell[1]}"][data-row="${cell[0]}"][data-owner="human"]`);
            shipCells.push(targetedCell);
        }

        shipCells = shipCells.map(c => ({
            row: parseInt(c.dataset.row, 10),
            col: parseInt(c.dataset.column, 10)
        }));

        e.dataTransfer.setData("application/json", JSON.stringify({
            shipIndex,
            indexOfSelectedCell,
            orientation,
            cells: shipCells
        }));
    }

    function dragOverHandler(e) {
        e.preventDefault();
    }

    function dropHandler(e) {
        e.preventDefault();

        //Retrieving data
        const data = JSON.parse(e.dataTransfer.getData("application/json"));
        const shipId = data.shipIndex;
        const oldCells = data.cells;
        const indexOfSelectedCell = data.indexOfSelectedCell;
        const orientation = data.orientation;

        //Getting frop Data
        const dropCell = e.target.closest('.cell');
        const targetRow = parseInt(dropCell.dataset.row, 10);
        const targetCol = parseInt(dropCell.dataset.column, 10);

        //Calculating offset
        let drow, dcol;
        if (orientation === 'vertical') {
            drow = targetRow - oldCells[0].row - indexOfSelectedCell;
            dcol = targetCol - oldCells[0].col;
        } else {
            drow = targetRow - oldCells[0].row;
            dcol = targetCol - oldCells[0].col - indexOfSelectedCell;
        }

        //Getting new boat position
        const newCells = oldCells.map(c => ({
            row: c.row + drow,
            col: c.col + dcol
        }));

        //Check if valid here
        if (!checkIfShipIsInsideBoard(newCells)) return alert('cannot place a ship outside the board !'); 
        //update old cells to water
        removeShip(players[0], players[0].gameboard.ships[shipId]);

        //Changing the ship coordinates
        players[0].gameboard.ships[shipId].coordinates = [];
        for (let cell of newCells) {
            players[0].gameboard.ships[shipId].coordinates.push([cell.row, cell.col]);
        }

        //update new cells to ship cells
        renderNewShip(players[0], players[0].gameboard.ships[shipId]);
    }

    function checkIfShipIsInsideBoard(coordinates) {
        for (let cell of coordinates) {
            if (cell.row < 0 || cell.row > 9 || cell.col < 0 || cell.col > 9) return false;
        }
        return true;
    }

    const computerPlays = () => {
        let row = Math.floor(Math.random() * 10);
        let col = Math.floor(Math.random() * 10);

        let roundisPlayed = game.playRound(row, col);

        //plays until he enters a valid cell
        while (!roundisPlayed) {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            roundisPlayed = game.playRound(row, col);
        }
        return [row, col];
    }
}

screenController();