export default class DOMController {
  constructor() {
    this.messageArea = document.querySelector('.message');
  }

  setGame(game) {
    this.game = game;
  }

  startGame() {
    const enemyBoardGrid = this.drawBoard(this.game.player2.board);
    enemyBoardGrid.classList.add('enemy');
    const playerBoardGrid = this.drawBoard(this.game.player1.board, true);
    playerBoardGrid.classList.add('player');
    document.querySelector('.boards').append(enemyBoardGrid, playerBoardGrid);
  }

  clearMessage() {
    this.messageArea.innerHTML = '';
  }

  showMessage(msg) {
    const newMessage = document.createElement('p');
    newMessage.innerText = msg;
    this.messageArea.appendChild(newMessage);
  }

  updateSquare(square, player, hit = false) {
    if (hit) {
      square.classList.add('hit');
      this.showMessage(`${player.name} Hit!`);
    } else {
      square.classList.add('miss');
      this.showMessage(`${player.name} Miss`);
    }
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
        square.dataset.position = `${i},${j}`;

        if (self && board.shipAt([i, j]) !== null) {
          square.classList.add('ship');
        }

        if (!self)
          square.addEventListener('click', (e) => this.game.receiveInput(e));

        row.appendChild(square);
      }

      container.appendChild(row);
    }
    return container;
  }
}
