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

            const content = player.gameboard.getBoard()[indexRow][indexCol].type.content;
            if (content === 'water') {
                cellButton.classList.add('water');
            } else if (content === 'ship') {
                cellButton.classList.add('ship');
            }

            board.appendChild(cellButton);
        })
    })
    container.appendChild(board);
}

export function eventHandler(e) {
    const selectedRow = e.target.dataset.row;
    const selectedCol = e.target.dataset.column;

    if (!selectedCol || !selectedRow) return;

    

    //playround()
    //update screen()
}