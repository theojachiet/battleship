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
        this.currentPlayer = players[0];
        this.otherPlayer = players[1];
    }

    addTurn() {
        if (this.currentPlayer === this.players[0]) {
            this.currentPlayer = this.players[1];
            this.otherPlayer = this.players[0];
        }
        else {
            this.currentPlayer = this.players[0];
            this.otherPlayer = this.players[1];
        }
    }

    playRound(row, col) {
        //Check if player inputed a valid cell
        //make the call to continue and print a new board
        this.otherPlayer.gameboard.receiveAttack(row, col);
        this.addTurn();
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

    let currentPlayerAttacked = computer;
    let currentBoardAttacked = computerBoard;

    function eventHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.column;

        if (!selectedCol || !selectedRow) return;

        //Play the round and update the board
        game.playRound(selectedRow, selectedCol);
        // currentBoardAttacked.remove();
        // displayBoard(currentPlayerAttacked);
        updateBoard(currentPlayerAttacked, selectedRow, selectedCol)

        // switchPlayer();
    }

    const switchPlayer = () => {
        //switch event listeners to change the round
        if (game.currentPlayer.type === 'computer') {
            computerBoard.removeEventListener('click', eventHandler);
            playerBoard.addEventListener('click', eventHandler);
            currentPlayerAttacked = player;
            currentBoardAttacked = playerBoard;
        } else {
            playerBoard.removeEventListener('click', eventHandler);
            computerBoard.addEventListener('click', eventHandler);
            currentPlayerAttacked = computer;
            currentBoardAttacked = computerBoard;
        }
    }
}

screenController();

