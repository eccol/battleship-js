export default class DOMController {
  constructor() {
    this.messageArea = document.querySelector('.message');
  }

  setGame(game) {
    this.game = game;
  }

  startGame() {
    this.drawBoard(this.game.player2.board, 'main');
    this.drawBoard(this.game.player1.board, 'side', true);

    this.showMessage('Start!');
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

  drawBoard(board, size, self = false) {
    if (!['main', 'side'].includes(size))
      throw new Error('Invalid board position');

    const container = document.querySelector(`.board.${size}`);
    container.innerHTML = '';

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

        if (!self) {
          square.addEventListener('click', (e) => {
            this.game.receiveInput(e);
          });
          square.addEventListener('mouseover', (e) => {
            this.highlightAttack(e);
          });
        }

        if (this.game.placementPhase) {
          square.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.game.togglePlacementDirection();
            square.dispatchEvent(new Event('mouseover'));
            return false;
          });
          square.addEventListener('mouseover', (e) =>
            this.highlightPlacement(e),
          );
        }

        row.appendChild(square);
      }

      container.appendChild(row);
    }
  }

  highlightAttack(e) {
    document
      .querySelectorAll('.select')
      .forEach((element) => element.classList.remove('select'));
    e.target.classList.add('select');
  }

  highlightPlacement(e) {
    document
      .querySelectorAll('.select')
      .forEach((element) => element.classList.remove('select'));
    const target = e.target;
    const targetCoords = target.dataset.position.split(',');
    const coordX = Number(targetCoords[0]);
    const coordY = Number(targetCoords[1]);

    for (let i = 0; i < this.game.nextShipLength(); i++) {
      let dx = 0;
      let dy = 0;
      if (this.game.placementDirection === 'h') {
        dx = i;
      } else {
        dy = i;
      }
      const square = document.querySelector(
        `[data-position="${coordX + dx},${coordY + dy}`,
      );
      if (square) square.classList.add('select');
    }
  }

  setPlacement() {
    document.querySelectorAll('.select').forEach((element) => {
      element.classList.remove('select');
      element.classList.add('ship');
    });
  }
}
