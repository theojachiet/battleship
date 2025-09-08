import './reset.css';
import './general.css';

import { Player } from './player.js';
import { displayBoard, updateBoard } from './DOM.js';
import { Ship } from './ship.js';


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

    placeShips(player);
    placeShips(computer);

    displayBoard(player);
    displayBoard(computer);

    const boards = document.querySelectorAll('.board');
    const playerBoard = boards[0];
    const computerBoard = boards[1];
    computerBoard.addEventListener('click', eventHandler);

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

    const computerPlays = () => {
        let row = Math.floor(Math.random() * 10);
        let col = Math.floor(Math.random() * 10);

        let roundisPlayed = game.playRound(row, col);
        console.log(row + ' ' + col)

        while (!roundisPlayed) {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            roundisPlayed = game.playRound(row, col);
        }

        return [row, col];
    }
}

screenController();