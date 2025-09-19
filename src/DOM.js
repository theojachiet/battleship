import { GameBoard } from "./gameboard.js";

const container = document.querySelector('.container');

export function displayBoard(player) {
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

            //Making it draggabble
            cellButton.setAttribute('draggable', 'true');

            if (player.type === 'computer') {
                cellButton.classList.add('water');
                board.appendChild(cellButton);
            } else {
                const content = player.gameboard.getBoard()[indexRow][indexCol].type.content;
                let specialContent = player.gameboard.getBoard()[indexRow][indexCol].content;

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
                }

                board.appendChild(cellButton);
            }
        })
    });

    //Adding label
    const label = document.createElement('p');
    label.classList.add('label');
    label.textContent = player.type;

    //Appending to containers
    boardContainer.appendChild(board);
    boardContainer.appendChild(label);
    container.appendChild(boardContainer);
}

export function updateBoard(player, row, col) {
    const selectedCell = document.querySelector(`[data-column="${col}"][data-row="${row}"][data-owner="${player.type}"]`);
    let state = player.gameboard.board[row][col].type.content;

    if (state === 'attacked') selectedCell.className = 'cell attacked';
    else if (state === 'ship') {
        selectedCell.className = 'cell damaged';
        //Find the ship object
        const ship = player.gameboard.getBoard()[row][col].type;
        if (ship.isSunk()) {
            //Show that all the ship is sunk by changing the color
            for (let part of ship.coordinates) {
                const shipCell = document.querySelector(`[data-column="${part[1]}"][data-row="${part[0]}"][data-owner="${player.type}"]`);
                shipCell.classList.add('sunk');
            }
        }
    }
}

export function removeShip(player, ship) {
    for (let cell of ship.coordinates) {
        const oldShipCell = document.querySelector(`[data-column="${cell[1]}"][data-row="${cell[0]}"][data-owner="human"]`);
        player.gameboard.board[cell[0]][cell[1]].type.content = 'water';
        oldShipCell.className = 'cell water';
        oldShipCell.dataset.type = 'water';
        oldShipCell.setAttribute('draggable', 'false');
        player.gameboard.clearSpot(cell[0], cell[1]);
    }
}

export function renderNewShip(player, ship) {
    for (let cell of ship.coordinates) {
        const newShipCell = document.querySelector(`[data-column="${cell[1]}"][data-row="${cell[0]}"][data-owner="human"]`);
        player.gameboard.board[cell[0]][cell[1]].type.content = 'ship';
        newShipCell.className = 'cell ship';
        newShipCell.dataset.type = 'ship';
        newShipCell.setAttribute('draggable', 'true');
        player.gameboard.replaceShip(ship, cell[0], cell[1]);
    }
}

//Get the whole ship instead of the cell (handle in the dragstart ?)
//Highlight the targeted cells in red or green depending on the validity of the target
//Either placing the ship and redraw the board if it s a valid location or move it back to its original locaiton if the drop is invalid