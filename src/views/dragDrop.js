import * as DOM from './DOM.js';

export function enableDragAndDrop(boardEl, game) {
  boardEl.addEventListener('dragstart', e => handleDragStart(e, game));
  boardEl.addEventListener('dragover', handleDragOver);
  boardEl.addEventListener('drop', e => handleDrop(e, game));
}

export function disableDragAndDrop(boardEl) {
  boardEl.removeEventListener('dragstart', handleDragStart);
  boardEl.removeEventListener('dragover', handleDragOver);
  boardEl.removeEventListener('drop', handleDrop);

  boardEl.querySelectorAll('.cell').forEach(c => c.setAttribute('draggable', 'false'));
}

function handleDragStart(e, game) {
  const { currentPlayer } = game;
  const row = e.target.dataset.row;
  const col = e.target.dataset.column;
  const type = e.target.dataset.type;

  if (!row || !col || type !== 'ship') return;

  const ship = currentPlayer.gameboard.getShip(row, col);
  const cells = ship.coordinates.map(([r, c]) => ({
    row: parseInt(r, 10),
    col: parseInt(c, 10)
  }));

  const payload = {
    shipIndex: ship.index,
    orientation: ship.orientation,
    cells,
    indexOfSelectedCell: cells.findIndex(c => c.row == row && c.col == col)
  };

  e.dataTransfer.setData('application/json', JSON.stringify(payload));
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e, game) {
  e.preventDefault();
  const { currentPlayer } = game;

  const dropCell = e.target.closest('.cell');
  if (!dropCell) return;

  const payload = JSON.parse(e.dataTransfer.getData('application/json'));
  const { shipIndex, orientation, cells, indexOfSelectedCell } = payload;

  const targetRow = parseInt(dropCell.dataset.row, 10);
  const targetCol = parseInt(dropCell.dataset.column, 10);

  // compute offset
  const dRow = orientation === 'vertical'
    ? targetRow - cells[0].row - indexOfSelectedCell
    : targetRow - cells[0].row;
  const dCol = orientation === 'horizontal'
    ? targetCol - cells[0].col - indexOfSelectedCell
    : targetCol - cells[0].col;

  const newCells = cells.map(c => ({
    row: c.row + dRow,
    col: c.col + dCol
  }));

  if (!checkIfShipIsInsideBoard(newCells)) {
    alert('Ship cannot be placed outside the board.');
    return;
  }

  const ship = currentPlayer.gameboard.ships[shipIndex];
  DOM.removeShip(currentPlayer, ship);

  if (!currentPlayer.gameboard.spotIsSeparatedFromOthers(ship, newCells[0].row, newCells[0].col)) {
    return DOM.renderNewShip(currentPlayer, ship);
  }

  ship.coordinates = newCells.map(c => [c.row, c.col]);
  DOM.renderNewShip(currentPlayer, ship);
}

function checkIfShipIsInsideBoard(coordinates) {
  return coordinates.every(c => c.row >= 0 && c.row < 10 && c.col >= 0 && c.col < 10);
}