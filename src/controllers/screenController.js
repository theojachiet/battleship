import * as DOM from '../views/DOM.js';
import { placeRandomShips } from '../utils/placement.js';
import { disableDragAndDrop, enableDragAndDrop } from '../views/dragDrop.js';
import { ComputerAI } from './computerAI.js';

export const screenController = (() => {
    let game; //Gameflow Instance
    const dialog = document.querySelector('dialog');
    const container = document.querySelector('.container');
    let ai;

    container.addEventListener('click', (e) => {
        const cell = e.target.closest('.cell');
        if (!cell) return;

        // only attack computer's board
        if (cell.dataset.owner === 'computer') {
            handleAttackClick(e);
        }
    });

    function start(newGame) {
        game = newGame;
        ai = new ComputerAI(game.computer.gameboard);

        randomizeAndRender(game.currentPlayer, game.otherPlayer);

        const randomizeButton = document.querySelector('button.randomize');
        randomizeButton.addEventListener('click', () => randomizeAndRender());

        const switchButton = document.querySelector('button.switch');
        switchButton.addEventListener('click', () => {
            game.switchOpponent();
            DOM.switchButtonOpponent(switchButton);
            randomizeAndRender(game.currentPlayer, game.otherPlayer);
        });
    }

    function randomizeAndRender(player1 = game.currentPlayer, player2 = game.otherPlayer) {
        playerReset(player1);
        playerReset(player2);

        if (player2.type === 'computer') {
            const { playerBoard, opponentBoard } = renderBoards(player1, player2, { showSubmit: false });

            enableDragAndDrop(playerBoard, game);
        } else {
            const { playerBoard, opponentBoard } = renderBoards(player1, player2, { showSubmit: false, showReady: true });

            enableDragAndDrop(playerBoard, game);

            //ready button add event listener click to ready only for player1
            const readyPlayerButton = document.querySelector('button.ready');
            readyPlayerButton.addEventListener('click', board1ReadyHandler);
        }
    }

    function playerReset(player) {
        player.ready = false;
        player.gameboard.gameOver = false;
        player.gameboard.attacks = [];
        player.hasMadeMove = false;

        player.ismyTurn = (player === game.currentPlayer);

        player.gameboard.clearBoard();
        placeRandomShips(player);
    }

    function renderNextRound() {
        if (!game.opponent.ready) {
            const { playerBoard, opponentBoard } = renderBoards(game.human, game.opponent, { showSubmit: false, showReady: true });

            const readyPlayerButton = document.querySelector('button.ready');
            readyPlayerButton.removeEventListener('click', board1ReadyHandler);
            readyPlayerButton.addEventListener('click', board2ReadyHandler);

            enableDragAndDrop(opponentBoard, game);
            return;
        }

        const { playerBoard, opponentBoard, submitButton } = renderBoards(game.human, game.opponent, { showSubmit: true });

        submitButton.addEventListener('click', submitMove);

        if (!game.human.ready || !game.opponent.ready) return; //Both players should be ready

        if (game.human.ismyTurn) {
            opponentBoard.addEventListener('click', handleAttackClick);
        } else {
            playerBoard.addEventListener('click', handleAttackClick);
        }

    }

    function renderBoards(player1, player2, { showSubmit = false, showReady = false } = {}) {
        DOM.clearContainer();
        DOM.displayBoard(player1, player2);

        let submitButton = null;
        if (showSubmit) {
            submitButton = document.createElement('button');
            submitButton.textContent = 'Submit Move';
            submitButton.classList.add('submit');
            container.appendChild(submitButton);
        }

        if (showReady) {
            DOM.createReadyButton();
        }

        DOM.displayBoard(player2, player1);

        const boards = container.querySelectorAll('.board');
        return {
            playerBoard: boards[0],
            opponentBoard: boards[1],
            submitButton: container.querySelector('button.submit') || null
        };
    }

    function handleAttackClick(e) {
        const selectedRow = e.target.dataset.row
        const selectedCol = e.target.dataset.column;

        if (!selectedCol || !selectedRow) return;

        //Play the round and update the board (to the current player because it was changed in the playround function)
        const result = game.playRound(selectedRow, selectedCol);

        if (!result.valid) return;

        const boards = document.querySelectorAll('.board');
        const playerBoard = boards[0];
        const opponentBoard = boards[1];

        disableDragAndDrop(playerBoard);

        DOM.updateBoard(game.currentPlayer, selectedRow, selectedCol, result.hit);

        if (result.ship) if (result.ship.sunk) DOM.markShipSunk(game.currentPlayer, result.ship);

        if (result.gameOver) {
            DOM.showGameOver(result.winner);
            opponentBoard.removeEventListener('click', handleAttackClick);
            return;
        }

        if (game.currentPlayer.type === 'computer') {
            playComputerTurn();
        } else {
            updateTurnDisplay();
            DOM.updateDescription(game.otherPlayer, selectedRow, selectedCol, result);
            game.otherPlayer.hasMadeMove = true;
        }
    }

    function playComputerTurn() {
        const { row, col } = ai.getNextMove();
        const result = game.playRound(row, col);
        ai.registerHit(row, col, result);

        DOM.updateBoard(game.currentPlayer, row, col, result.hit);
        DOM.updateDescription(game.otherPlayer, row, col, result);

        if (result.ship) if (result.ship.sunk) DOM.markShipSunk(game.currentPlayer, result.ship);
        if (result.gameOver) {
            DOM.showGameOver(result.winner);
            game.addTurn();
            return;
        }
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

    function board1ReadyHandler() {
        game.human.ready = true;
        game.addTurn();

        const dialogText = document.querySelector('.text');
        dialogText.textContent = `${game.otherPlayer.name} is ready, pass the device to ${game.currentPlayer.name}`;

        dialog.showModal();
        dialog.addEventListener('submit', readyDialogHandler);
    }

    function board2ReadyHandler(e) {
        game.opponent.ready = true;
        game.addTurn();

        const dialogText = document.querySelector('.text');
        dialogText.textContent = `${game.otherPlayer.name} is ready, pass the device to ${game.currentPlayer.name}`;

        dialog.showModal();
    }

    function readyDialogHandler(e) {
        e.preventDefault();
        renderNextRound();
        dialog.close();
    }

    function submitMove() {

        //TODO : detect if the player has already made a move, if not, show an alert
        if (!game.otherPlayer.hasMadeMove) {
            alert('Make a move before submitting !');
            return;
        }

        game.otherPlayer.hasMadeMove = false;

        const dialogText = document.querySelector('.text');
        dialogText.textContent = `${game.otherPlayer.name} has played, pass the device to ${game.currentPlayer.name}`;

        dialog.showModal();
        dialog.addEventListener('submit', (e) => {
            e.preventDefault();
            renderNextRound();
            dialog.close();
        });
    }


    return { start };
})();