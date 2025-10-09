import * as DOM from './DOM.js';
import { placeRandomShips } from '../utils/placement.js';
import { disableDragAndDrop, enableDragAndDrop } from '../views/dragDrop.js';

export const screenController = (() => {
    let game; //Gameflow Instance
    const dialog = document.querySelector('dialog');
    const container = document.querySelector('.container');

    function start(newGame) {
        game = newGame;

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
        player1.ready = false;
        player2.ready = false;

        //keep it consistent with the gameflow
        player1.ismyTurn = (player1 === game.currentPlayer);
        player2.ismyTurn = (player2 === game.currentPlayer);

        player1.gameboard.clearBoard();
        player2.gameboard.clearBoard();
        placeRandomShips(player1);
        placeRandomShips(player2);

        const { playerBoard, opponentBoard } = renderBoards(player1, player2, { showSubmit: false, enableDrag: true });

        if (player2.type === 'computer') {
            enableDragAndDrop(playerBoard, game);
            opponentBoard.addEventListener('click', handleAttackClick);
        } else {
            enableDragAndDrop(playerBoard, game);

            //ready button add event listener click to ready only for player1
            const readyPlayers = document.querySelectorAll('button.ready');
            const readyPlayer1Button = readyPlayers[0];
            readyPlayer1Button.addEventListener('click', board1ReadyHandler);
        }
    }

    function renderNextRound() {
        const { playerBoard, opponentBoard, submitButton } = renderBoards(game.human, game.opponent, { showSubmit: true });

        submitButton.addEventListener('click', submitMove);

        if (!game.human.ready || !game.opponent.ready) return; //Both players should be ready

        if (game.human.ismyTurn) {
            opponentBoard.addEventListener('click', handleAttackClick);
        } else {
            playerBoard.addEventListener('click', handleAttackClick);
        }

    }

    function renderBoards(player1, player2, { showSubmit = false, enableDrag = false } = {}) {
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

        if (enableDrag) enableDragAndDrop(playerBoard, game);

        return { playerBoard, opponentBoard, submitButton };
    }

    function handleAttackClick(e) {
        const selectedRow = e.target.dataset.row
        const selectedCol = e.target.dataset.column;

        if (!selectedCol || !selectedRow) return;

        //Play the round and update the board (to the current player because it was changed in the playround function)
        const result = game.playRound(selectedRow, selectedCol);

        if (!result.valid) return;

        const playerBoard = document.querySelector('.board');
        disableDragAndDrop(playerBoard);

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

    function board1ReadyHandler() {
        game.human.ready = true;
        game.addTurn();

        const dialogText = document.querySelector('.text');
        dialogText.textContent = `${game.otherPlayer.name} is ready, pass the device to ${game.currentPlayer.name}`;

        dialog.showModal();
        dialog.addEventListener('submit', board1DialogHandler);
    }

    function board2ReadyHandler(e) {
        game.opponent.ready = true;
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

        enableDragAndDrop(opponentBoard, game);
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


    return { start };
})();

// function screenController() {
//     const player = new Player('human', true, 'theo');
//     const computer = new Player('computer', false, 'computer');
//     const opponent = new Player('human', false, 'cyrielle');
//     const players = [player, computer, opponent]

//     const game = new GameFlow(players);


// }