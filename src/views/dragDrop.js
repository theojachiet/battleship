function enableDragAndDrop(boardElement, onDropShip) {
  const cells = boardElement.querySelectorAll('.cell');

  cells.forEach(cell => {
    cell.addEventListener('dragstart', handleDragStart);
    cell.addEventListener('dragover', handleDragOver);
    cell.addEventListener('drop', e => handleDrop(e, onDropShip));
  });
}

function handleDragStart(e) {
  const cell = e.target;
  if (cell.dataset.type !== 'ship') return;
  e.dataTransfer.setData('text/plain', JSON.stringify({
    row: cell.dataset.row,
    col: cell.dataset.column,
    player: cell.dataset.name
  }));
}

function handleDragOver(e) {
  e.preventDefault(); // Allow drop
}

function handleDrop(e, onDropShip) {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  const target = e.target;
  if (!target.classList.contains('cell')) return;

  const targetRow = Number(target.dataset.row);
  const targetCol = Number(target.dataset.column);
  onDropShip(data, { row: targetRow, col: targetCol });
}

export { enableDragAndDrop };
