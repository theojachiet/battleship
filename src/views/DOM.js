import { GameBoard } from "../models/gameboard.js";

const container = document.querySelector('.container');

function displayBoard(player, opponent = 'none') {

    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board-container');

    const board = document.createElement('div');
    board.classList.add('board');

    player.gameboard.getBoard().forEach((row, indexRow) => {
        row.forEach((cell, indexCol) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');

            cellButton.dataset.column = indexCol;
            cellButton.dataset.row = indexRow;
            cellButton.dataset.owner = player.type;
            cellButton.dataset.name = player.name;

            //Making it draggabble
            cellButton.setAttribute('draggable', 'true');

            const content = player.gameboard.getBoard()[indexRow][indexCol].type.content;
            let specialContent = player.gameboard.getBoard()[indexRow][indexCol].content;

            if (player.type === 'computer') {
                cellButton.classList.add('water');
                board.appendChild(cellButton);
            } else if (!player.ismyTurn) {
                if (content === 'attacked') {
                    cellButton.classList.add('attacked');
                } else {
                    cellButton.classList.add('water');
                    cellButton.dataset.type = 'water';
                    cellButton.setAttribute('draggable', 'false');
                }

                if (specialContent === 'damagedShip') {
                    cellButton.classList.add('damaged');
                    const ship = player.gameboard.getBoard()[indexRow][indexCol].type;
                    if (ship.isSunk()) {
                        cellButton.classList.add('sunk');
                    }
                }

                board.appendChild(cellButton);
            } else {
                if (content === 'water') {
                    cellButton.classList.add('water');
                    cellButton.dataset.type = 'water';
                    cellButton.setAttribute('draggable', 'false');
                } else if (content === 'ship') {
                    cellButton.classList.add('ship');
                    cellButton.dataset.type = 'ship';
                } else if (content === 'attacked') {
                    cellButton.classList.add('attacked');
                }

                if (specialContent === 'damagedShip') {
                    cellButton.classList.add('damaged');
                    const ship = player.gameboard.getBoard()[indexRow][indexCol].type;
                    if (ship.isSunk()) {
                        cellButton.classList.add('sunk');
                    }
                }

                board.appendChild(cellButton);
            }
        })
    });

    //Adding label
    const label = document.createElement('p');
    label.classList.add('label');
    label.textContent = player.name;

    //Appending to containers
    boardContainer.appendChild(board);
    boardContainer.appendChild(label);

    if (opponent.type === 'human' && !(player.ready && opponent.ready)) {
        //Adding ready Up button
        const readyButton = document.createElement('button');
        readyButton.classList.add('ready');
        readyButton.textContent = 'Board Ready ?';

        if (player.ready) {
            readyButton.classList.add('green');
            readyButton.textContent = 'Board Ready !';
        }

        boardContainer.appendChild(readyButton);
    }

    container.appendChild(boardContainer);
}

function updateBoard(player, row, col) {
    const selectedCell = document.querySelector(`[data-column="${col}"][data-row="${row}"][data-name="${player.name}"]`);
    let state = player.gameboard.board[row][col].type.content;

    if (state === 'attacked') selectedCell.className = 'cell attacked';
    else if (state === 'ship') {
        selectedCell.className = 'cell damaged';
        //Find the ship object
        const ship = player.gameboard.getBoard()[row][col].type;
        if (ship.isSunk()) {
            //Show that all the ship is sunk by changing the color
            for (let part of ship.coordinates) {
                const shipCell = document.querySelector(`[data-column="${part[1]}"][data-row="${part[0]}"][data-name="${player.name}"]`);
                shipCell.classList.add('sunk');
            }
        }
    }
}

function removeShip(player, ship) {
    for (let cell of ship.coordinates) {
        const cells = document.querySelector(`[data-column="${cell[1]}"][data-row="${cell[0]}"]`);
        const oldShipCell = document.querySelector(`[data-column="${cell[1]}"][data-row="${cell[0]}"][data-name="${player.name}"]`);
        player.gameboard.board[cell[0]][cell[1]].type.content = 'water';
        oldShipCell.className = 'cell water';
        oldShipCell.dataset.type = 'water';
        oldShipCell.setAttribute('draggable', 'false');
        player.gameboard.clearSpot(cell[0], cell[1]);
    }
}

function renderNewShip(player, ship) {
    for (let cell of ship.coordinates) {
        const newShipCell = document.querySelector(`[data-column="${cell[1]}"][data-row="${cell[0]}"][data-name="${player.name}"]`);
        player.gameboard.board[cell[0]][cell[1]].type.content = 'ship';
        newShipCell.className = 'cell ship';
        newShipCell.dataset.type = 'ship';
        newShipCell.setAttribute('draggable', 'true');
        player.gameboard.replaceShip(ship, cell[0], cell[1]);
    }
}

function clearContainer() {
    container.textContent = '';
}

export { displayBoard, updateBoard, removeShip, renderNewShip, clearContainer};