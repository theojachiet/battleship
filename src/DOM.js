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

            cellButton.textContent = player.gameboard.getBoard()[indexRow][indexCol].type.content;

            board.appendChild(cellButton);
        })
    })
    container.appendChild(board);
}