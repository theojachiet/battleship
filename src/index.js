import './reset.css';
import './general.css';

import { Player } from './models/player.js';
import * as DOM from './views/DOM.js';
// import { displayBoard, removeShip, renderNewShip, updateBoard } from './views/DOM.js';
import { Ship } from './models/ship.js';
import { GameFlow } from './controllers/gameflow.js';
import { placeRandomShips } from './utils/placement.js';

const container = document.querySelector('.container');
const dialog = document.querySelector('dialog');
const playButton = document.querySelector('.submit')

function screenController() {
    const player = new Player('human', true, 'theo');
    const computer = new Player('computer', false, 'computer');
    const opponent = new Player('human', false, 'cyrielle');
    const players = [player, computer, opponent]

    const game = new GameFlow(players);

    function randomizeAndRender(player1 = game.currentPlayer, player2 = game.otherPlayer) {
        player1.ready = false;
        player2.ready = false;

        //keep it consistent with the gameflow
        player1.ismyTurn = (player1 === game.currentPlayer);
        player2.ismyTurn = (player2 === game.currentPlayer);

        player1.gameboard.clearBoard();
        player2.gameboard.clearBoard();
        placeRandomShips(player1);
        placeRandomShips(player2);

        const { playerBoard, opponentBoard } = renderBoards(player1, player2);

        if (player2.type === 'computer') {
            enableDragOnBoard(playerBoard);
            opponentBoard.addEventListener('click', handleAttackClick);
        } else {
            enableDragOnBoard(playerBoard);

            //ready button add event listener click to ready only for player1
            const readyPlayers = document.querySelectorAll('button.ready');
            const readyPlayer1Button = readyPlayers[0];
            readyPlayer1Button.addEventListener('click', board1ReadyHandler);
        }
    }

    function renderNextRound() {
        const { playerBoard, opponentBoard, submitButton } = renderBoards(players[0], players[2], { showSubmit: true });

        submitButton.addEventListener('click', submitMove);

        if (!players[0].ready || !players[2].ready) return; //Both players should be ready

        if (players[0].ismyTurn) {
            opponentBoard.addEventListener('click', handleAttackClick);
        } else {
            playerBoard.addEventListener('click', handleAttackClick);
        }

    }

    function renderBoards(player1, player2, { showSubmit = false } = {}) {
        DOM.clearContainer();
        DOM.displayBoard(player1, player2);

        let submitButton = null;
        if (showSubmit) {
            submitButton = document.createElement('button');
            submitButton.textContent = 'Submit Move';
            submitButton.classList.add('submit');
            container.appendChild(submitButton);
        }

        DOM.displayBoard(player2, player1);

        const boards = document.querySelectorAll('.board');
        const [playerBoard, opponentBoard] = boards;

        return { playerBoard, opponentBoard, submitButton };
    }

    function enableDragOnBoard(boardEl) {
        boardEl.addEventListener('dragstart', dragStartHandler);
        boardEl.addEventListener('dragover', dragOverHandler);
        boardEl.addEventListener('drop', dropHandler);
    }

    function disableDragOnBoard(boardEl) {
        boardEl.removeEventListener('dragstart', dragStartHandler);
        boardEl.removeEventListener('dragover', dragOverHandler);
        boardEl.removeEventListener('drop', dropHandler);

        // make cells not draggable (some may still be draggable by attribute)
        boardEl.querySelectorAll('.cell').forEach(c => c.setAttribute('draggable', 'false'));
    }

    randomizeAndRender(players[0], players[1]);

    const boards = document.querySelectorAll('.board');
    const playerBoard = boards[0];

    const randomizeButton = document.querySelector('button.randomize');
    randomizeButton.addEventListener('click', () => randomizeAndRender());
    const switchButton = document.querySelector('button.switch');
    switchButton.addEventListener('click', () => {
        game.switchOpponent();
        DOM.switchButtonOpponent(switchButton);
        randomizeAndRender(game.currentPlayer, game.otherPlayer);
    });

    function handleAttackClick(e) {
        const selectedRow = e.target.dataset.row
        const selectedCol = e.target.dataset.column;

        if (!selectedCol || !selectedRow) return;

        //Play the round and update the board (to the current player because it was changed in the playround function)
        const result = game.playRound(selectedRow, selectedCol);

        if (!result.valid) return;

        const playerBoard = document.querySelector('.board');
        disableDragOnBoard(playerBoard);

        DOM.updateBoard(game.currentPlayer, selectedRow, selectedCol, result.hit);

        if (result.ship) if (result.ship.sunk) DOM.markShipSunk(game.currentPlayer, result.ship);
        if (result.gameOver) return showGameOver(result.winner);

        if (game.currentPlayer.type === 'computer') {
            playComputerTurn();
        } else {
            updateTurnDisplay();
        }
    }

    function playComputerTurn() {
        let row = Math.floor(Math.random() * 10);
        let col = Math.floor(Math.random() * 10);

        let result = game.playRound(row, col);

        //plays until he enters a valid cell
        while (!result.valid) {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            result = game.playRound(row, col);
        }

        DOM.updateBoard(game.currentPlayer, row, col, result.hit);

        if (result.ship) if (result.ship.sunk) DOM.markShipSunk(game.currentPlayer, result.ship);
        if (result.gameOver) return showGameOver(result.winner);
    }

    function updateTurnDisplay() {
        const boards = document.querySelectorAll('.board');
        const playerBoard = boards[0];
        const opponentBoard = boards[1];
        if (!game.human.ismyTurn) {
            opponentBoard.removeEventListener('click', handleAttackClick);
        }
        else {
            playerBoard.removeEventListener('click', handleAttackClick);
        }
    }

    function dragStartHandler(e) {

        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.column;
        const type = e.target.dataset.type;

        if (!selectedCol || !selectedRow) return;
        if (type !== 'ship') return alert('you cannnot move water');

        const ship = game.currentPlayer.gameboard.getShip(selectedRow, selectedCol);
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
            cells: shipCells,
            ship
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
        const ship = data.ship;
        const currentPlayer = game.currentPlayer;

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

        //Check if inside the board
        if (!checkIfShipIsInsideBoard(newCells)) return alert('cannot place a ship outside the board !');

        //update old cells to water
        DOM.removeShip(currentPlayer, currentPlayer.gameboard.ships[shipId]);

        //Check if the ship is separated from others
        if (!currentPlayer.gameboard.spotIsSeparatedFromOthers(ship, newCells[0].row, newCells[0].col)) {
            return DOM.renderNewShip(currentPlayer, ship);
        }

        //Changing the ship coordinates
        currentPlayer.gameboard.ships[shipId].coordinates = [];
        for (let cell of newCells) {
            currentPlayer.gameboard.ships[shipId].coordinates.push([cell.row, cell.col]);
        }

        //update new cells to ship cells
        DOM.renderNewShip(currentPlayer, currentPlayer.gameboard.ships[shipId]);
    }

    function checkIfShipIsInsideBoard(coordinates) {
        for (let cell of coordinates) {
            if (cell.row < 0 || cell.row > 9 || cell.col < 0 || cell.col > 9) return false;
        }
        return true;
    }

    function board1ReadyHandler() {
        players[0].ready = true;
        game.addTurn();

        const dialogText = document.querySelector('.text');
        dialogText.textContent = `${game.otherPlayer.name} is ready, pass the device to ${game.currentPlayer.name}`;

        dialog.showModal();
        dialog.addEventListener('submit', board1DialogHandler);
    }

    function board2ReadyHandler(e) {
        players[2].ready = true;
        game.addTurn();

        const dialogText = document.querySelector('.text');
        dialogText.textContent = `${game.otherPlayer.name} is ready, pass the device to ${game.currentPlayer.name}`;

        dialog.showModal();
        dialog.removeEventListener('submit', board1DialogHandler);
        dialog.addEventListener('submit', (e) => {
            e.preventDefault();
            renderNextRound();
            dialog.close();
        });
    }

    function board1DialogHandler(e) {
        e.preventDefault();
        renderNextRound();
        dialog.close();

        //Set up listeners for the next player
        const readyPlayers = document.querySelectorAll('button.ready');
        const readyPlayer2Button = readyPlayers[1];
        readyPlayer2Button.addEventListener('click', board2ReadyHandler);

        const boards = document.querySelectorAll('.board');
        const opponentBoard = boards[1];

        opponentBoard.addEventListener('dragstart', dragStartHandler)
        opponentBoard.addEventListener('dragover', dragOverHandler);
        opponentBoard.addEventListener('drop', dropHandler);
    }

    function submitMove() {

        const dialogText = document.querySelector('.text');
        dialogText.textContent = `${game.otherPlayer.name} has played, pass the device to ${game.currentPlayer.name}`;

        dialog.showModal();
        dialog.addEventListener('submit', (e) => {
            e.preventDefault();
            renderNextRound();
            dialog.close();
        });
    }
}

screenController();