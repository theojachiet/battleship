import { mergeWithCustomize } from "webpack-merge";

const container = document.querySelector('.container');

function displayBoard(player, opponent = 'none') {
  const boardContainer = document.createElement('div');
  boardContainer.classList.add('board-container');

  const board = document.createElement('div');
  board.classList.add('board');

  const boardData = player.gameboard.getBoard();

  // //Displaying Column Letters
  // const colLetters = document.createElement('p');
  // colLetters.classList.add('colLetters');
  // colLetters.textContent = 'A B C D E F G H I J';
  // boardContainer.appendChild(colLetters);

  for (let row = -1; row < boardData.length; row++) {
    if (row === -1) {
      const letters = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      for (let letter of letters) {
        const colLetter = document.createElement('span');
        colLetter.classList.add('colLetter');
        colLetter.textContent = letter;
        board.appendChild(colLetter);
      }
      row++;
    }
    //Displaying row Numbers
    const rowNumber = document.createElement('span');
    rowNumber.textContent = row + 1;
    rowNumber.classList.add('rowNumber');
    board.appendChild(rowNumber);

    for (let col = 0; col < boardData[row].length; col++) {
      const cellData = boardData[row][col];
      const cellButton = createCellButton(player, cellData, row, col);
      board.appendChild(cellButton);
    }

  }

  const label = document.createElement('p');
  label.classList.add('label');
  label.textContent = player.name;

  boardContainer.append(board, label);
  container.appendChild(boardContainer);
}

function createCellButton(player, cellData, row, col) {
  const btn = document.createElement('button');
  btn.classList.add('cell');
  btn.dataset.column = col;
  btn.dataset.row = row;
  btn.dataset.owner = player.type;
  btn.dataset.name = player.name;
  btn.setAttribute('draggable', 'true');

  const { content: cellContent, type: cellType } = cellData;
  const { content: typeContent } = cellType;

  // Determine the visual type of the cell
  if (player.type === 'computer') {
    btn.classList.add('water');
    btn.dataset.type = 'water';
    btn.setAttribute('draggable', 'false');
  }
  else if (!player.ismyTurn) {
    setNonTurnCellState(btn, typeContent, cellData);
  }
  else {
    setPlayerTurnCellState(btn, typeContent, cellData);
  }

  return btn;
}

function setNonTurnCellState(btn, typeContent, cellData) {
  if (typeContent === 'attacked') {
    btn.classList.add('attacked');
  } else {
    btn.classList.add('water');
    btn.dataset.type = 'water';
    btn.setAttribute('draggable', 'false');
  }
  applyDamageState(btn, cellData);
}

function setPlayerTurnCellState(btn, typeContent, cellData) {
  if (typeContent === 'water') {
    btn.classList.add('water');
    btn.dataset.type = 'water';
    btn.setAttribute('draggable', 'false');
  } else if (typeContent === 'ship') {
    btn.classList.add('ship');
    btn.dataset.type = 'ship';
  } else if (typeContent === 'attacked') {
    btn.classList.add('attacked');
  }
  applyDamageState(btn, cellData);
}

function applyDamageState(btn, cellData) {
  if (cellData.content !== 'damagedShip') return;

  btn.classList.add('damaged');

  const ship = cellData.type;
  if (ship.isSunk()) {
    btn.classList.add('sunk');
  }
}

function createReadyButton() {
  const readyButton = document.createElement('button');
  readyButton.classList.add('ready');
  readyButton.textContent = 'Ready ?';

  container.appendChild(readyButton);
}

function updateBoard(player, row, col, state) {
  const selectedCell = document.querySelector(`[data-column="${col}"][data-row="${row}"][data-name="${player.name}"]`);

  if (state === 'attacked') selectedCell.className = 'cell attacked';
  else if (state === 'ship') {
    selectedCell.className = 'cell damaged';
  }
}

function markShipSunk(player, ship) {
  for (let part of ship.coordinates) {
    const shipCell = document.querySelector(`[data-column="${part[1]}"][data-row="${part[0]}"][data-name="${player.name}"]`);
    shipCell.classList.add('sunk');
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

function switchButtonOpponent(switchButton) {
  if (switchButton.textContent === 'Switch to Human Opponent') switchButton.textContent = 'Switch to Computer Opponent';
  else switchButton.textContent = 'Switch to Human Opponent';
}

function showGameOver(winner) {
  alert('Game Over : ' + winner.name + ' won !');
}

export { displayBoard, updateBoard, removeShip, renderNewShip, clearContainer, markShipSunk, switchButtonOpponent, createReadyButton, showGameOver };