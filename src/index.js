import './reset.css';
import './general.css';

import { Player } from './player.js';
import { displayBoard, hideBoard, removeShip, renderNewShip, updateBoard } from './DOM.js';
import { Ship } from './ship.js';

const container = document.querySelector('.container');
const dialog = document.querySelector('dialog');
const playButton = document.querySelector('.submit')

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
        this.opponent = players[2];

        this.currentPlayer = this.human;
        this.otherPlayer = this.computer;

        this.playingAgainstHuman = false;
    }

    changeOpponent() {
        //POtential problem !! If we switch opponent after a few rounds and it changes the wrong players because it is using other player var
        if (this.playingAgainstHuman === false) this.otherPlayer = this.opponent;
        else this.otherPlayer = this.computer;
        this.playingAgainstHuman = !this.playingAgainstHuman;
    }

    addTurn() {
        const secondPlayer = this.playingAgainstHuman ? this.opponent : this.computer;

        const prevPlayer = this.currentPlayer;
        this.currentPlayer = (this.currentPlayer === this.human) ? secondPlayer : this.human;
        this.otherPlayer = prevPlayer;
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
    const player = new Player('human', true, 'theo');
    const computer = new Player('computer', false, 'computer');
    const opponent = new Player('human', false, 'cyrielle');
    const players = [player, computer, opponent];

    const game = new GameFlow(players);

    function randomizeAndRender(player1 = game.currentPlayer, player2 = game.otherPlayer) {
        player1.gameboard.clearBoard();
        player2.gameboard.clearBoard();

        placeRandomShips(player1);
        placeRandomShips(player2);

        container.textContent = '';

        if (player2.type === 'computer') {
            displayBoard(player1);
            displayBoard(player2);

            const boards = document.querySelectorAll('.board');
            const computerBoard = boards[1];
            const playerBoard = boards[0];

            computerBoard.addEventListener('click', eventHandler);
            playerBoard.addEventListener('dragstart', dragStartHandler);
            playerBoard.addEventListener('dragover', dragOverHandler);
            playerBoard.addEventListener('drop', dropHandler);
        } else {
            displayBoard(player1, player2);

            //Add Submit button in between the boards
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit Move';
            submitButton.classList.add('submit');
            container.appendChild(submitButton);

            displayBoard(player2, player1);

            const boards = document.querySelectorAll('.board');
            const opponentBoard = boards[1];
            const playerBoard = boards[0];

            //Allow player1 to modify his board and make it ready
            playerBoard.addEventListener('dragstart', dragStartHandler);
            playerBoard.addEventListener('dragover', dragOverHandler);
            playerBoard.addEventListener('drop', dropHandler);

            //ready button add event listener click to readye
            const readyPlayers = document.querySelectorAll('button.ready');
            const readyPlayer1Button = readyPlayers[0];
            const readyPlayer2Button = readyPlayers[1];
            readyPlayer1Button.addEventListener('click', board1ReadyHandler);
            readyPlayer2Button.addEventListener('click', board2ReadyHandler);
        }
            console.log(game.currentPlayer);
    }

    function renderNextRound() {
        container.textContent = '';

        console.log(game.currentPlayer);

        displayBoard(players[0], players[2]);

        //Add Submit button in between the boards
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Move';
        submitButton.classList.add('submit');
        container.appendChild(submitButton);

        displayBoard(players[2], players[0]);
    }

    randomizeAndRender(players[0], players[1]);

    const boards = document.querySelectorAll('.board');
    const computerBoard = boards[1];
    const playerBoard = boards[0];

    const randomizeButton = document.querySelector('button.randomize');
    randomizeButton.addEventListener('click', () => randomizeAndRender());
    const switchButton = document.querySelector('button.switch');
    switchButton.addEventListener('click', switchOpponent);

    function eventHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.column;

        if (!selectedCol || !selectedRow) return;

        //remove the drag an drop ability
        playerBoard.removeEventListener('dragstart', dragStartHandler);
        playerBoard.removeEventListener('dragover', dragOverHandler);
        playerBoard.removeEventListener('drop', dropHandler);

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
        if (type !== 'ship') return alert('you cannnot move water');

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
        removeShip(players[0], players[0].gameboard.ships[shipId]);

        //Check if the ship is separated from others
        if (!players[0].gameboard.spotIsSeparatedFromOthers(ship, newCells[0].row, newCells[0].col)) {
            return renderNewShip(players[0], ship);
        }

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

    function switchOpponent() {
        if (switchButton.textContent === 'Switch to Human Opponent') switchButton.textContent = 'Switch to Computer Opponent';
        else switchButton.textContent = 'Switch to Human Opponent';
        game.changeOpponent();
        randomizeAndRender(game.currentPlayer, game.otherPlayer);
    }

    function board1ReadyHandler(e) {
        e.target.style.backgroundColor = 'green';
        console.log(game.currentPlayer);
        game.addTurn();

        dialog.showModal();
        dialog.addEventListener('submit', (e) => {
            e.preventDefault();
            renderNextRound();
            dialog.close();
        });
    }

    function board2ReadyHandler(e) {
        e.target.style.backgroundColor = 'green';
        game.addTurn();
        //Start the game:
        //Hide second player board
        //make a between rounds screen for the first players to click ready (same as when you click submit move)
        //When it is clicked, show first player board (repeat for all the rounds)
    }
}

screenController();

//Switch opponent:
//Switch event listeners between boards
//Make a finish round button with a switch round screen
//Prevent the computer from playing
//Allow both players to drag and drop ships
//Make a confirm ship positions button for both players before starting the game