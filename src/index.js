import './reset.css';
import './general.css';

import { Player } from './player.js';
import { displayBoard, updateBoard } from './DOM.js';
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

        for (let cell of shipCoordinates) {
            if (cell[0] === selectedRow && cell[1] === selectedCol) continue;

            const targetedCell = document.querySelector(`[data-column="${cell[1]}"][data-row="${cell[2]}"][data-owner="player"]`);
            // e.dataTransfer.addElement(targetedCell);
        }

        console.log(ship);
        console.log(selectedCol + ' ' + selectedRow + ' ' + type);

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