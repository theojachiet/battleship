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
    })
    container.appendChild(board);
}

// export function updateBoard(board, row, col) {
//     board.getBoard()[row][col];
// }