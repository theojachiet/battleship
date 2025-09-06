const container = document.querySelector('.container');

export function displayBoard(player) {
    const board = document.createElement('div');
    board.classList.add('board');

    player.gameboard.getBoard().forEach((row, indexRow) => {
        row.forEach((cell, indexCol) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');

            cellButton.dataset.column = indexCol;
            cellButton.dataset.row = indexRow;
            cellButton.dataset.owner = player.type;

            const content = player.gameboard.getBoard()[indexRow][indexCol].type.content;
            let specialContent = player.gameboard.getBoard()[indexRow][indexCol].content;

            if (content === 'water') {
                cellButton.classList.add('water');
            } else if (content === 'ship') {
                cellButton.classList.add('ship');
            } else if (content === 'attacked') {
                cellButton.classList.add('attacked');
            }
            
            if (specialContent === 'damagedShip') {
                cellButton.classList.add('damaged');
            }

            board.appendChild(cellButton);
        })
    });

    container.appendChild(board);
}

export function updateBoard(player, row, col) {
    const selectedCell = document.querySelector(`[data-column="${col}"][data-row="${row}"][data-owner="${player.type}"]`);
    let state = selectedCell.classList[1];
    if (state === 'water') selectedCell.className = 'cell attacked';
    else selectedCell.className = 'cell damaged';
    console.log(selectedCell.classList);
}