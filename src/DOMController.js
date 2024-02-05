export default class DOMController {
  constructor() {
    this.messageArea = document.querySelector('.message');
  }

  setGame(game) {
    this.game = game;
  }

  startGame() {
    this.drawBoard(this.game.player2.board, 'main');
    this.drawBoard(this.game.player1.board, 'side', false);

    this.showMessage('Start!');
  }

  showMessage(msg, clear = false) {
    if (clear) {
      this.messageArea.innerText = msg;
    } else {
      this.messageArea.innerText += '\n' + msg;
    }
  }

  updateSquare(square, player, hit = false) {
    if (hit) {
      square.classList.add('hit');
      this.showMessage(`${player.name} Hit!`, false);
    } else {
      square.classList.add('miss');
      this.showMessage(`${player.name} Miss`, false);
    }
  }

  drawBoard(board, size, interactive = true) {
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
        square.dataset.position = `${j},${i}`;

        if (!interactive && board.shipAt([j, i]) !== null) {
          square.classList.add('ship');
        }

        if (interactive) {
          square.addEventListener('click', (e) => {
            this.game.handleInput(e);
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

  getSquareByCoordinates(coordinates, board) {
    return document.querySelector(
      `.${board} [data-position="${coordinates[0]},${coordinates[1]}"]`,
    );
  }
}
