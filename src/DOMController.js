export default class DOMController {
  init(game) {
    this.game = game;
    const enemyBoardGrid = this.drawBoard(game.player2.board);
    document.querySelector('.boards').appendChild(enemyBoardGrid);
    const playerBoardGrid = this.drawBoard(game.player1.board, true);
    document.querySelector('.boards').appendChild(playerBoardGrid);
  }

  drawBoard(board, self = false) {
    const container = document.createElement('div');
    container.classList.add('board-container');

    for (let i = 0; i < board.xLength; i++) {
      const row = document.createElement('div');
      row.classList.add('row');

      for (let j = 0; j < board.yLength; j++) {
        const square = document.createElement('div');
        square.classList.add('square');
        if (self) square.dataset.position = `${i},${j}`;

        if (self && board.shipAt([i, j]) !== null) {
          square.classList.add('ship');
        }

        square.addEventListener('click', () => {
          if (
            !self &&
            !this.game.isGameOver() &&
            !board.wasAlreadyGuessed([i, j])
          ) {
            if (this.game.player1.attack([i, j])) {
              square.classList.add('hit');
            } else {
              square.classList.add('miss');
            }
            this.game.makeCPUMove();
          }
        });

        row.appendChild(square);
      }

      container.appendChild(row);
    }
    return container;
  }
}
