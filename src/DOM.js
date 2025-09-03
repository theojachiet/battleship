const playerBoard = document.querySelector('.player-board');

export function displayBoard(player) {
    player.gameboard.getBoard().forEach((row, indexRow) => {
        row.forEach((cell, indexCol) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');

            cellButton.dataset.column = indexCol;
            cellButton.dataset.row = indexRow;

            cellButton.textContent = player.gameboard.getBoard()[indexRow][indexCol].type.content;

            playerBoard.appendChild(cellButton);
        })
    })
}