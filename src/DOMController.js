export default class DOMController {
  constructor() {
    this.messageArea = document.querySelector('.message');
    this.changeTurnCallback = null;
    this.changeTurnScreen = document.querySelector('.change-turns');
    this.changeTurnScreen
      .querySelector('button')
      .addEventListener('click', () => {
        this.changeTurnScreen.close();
        this.changeTurnCallback(true);
      });
  }

  setGame(game) {
    this.game = game;
  }

  showMessage(msg, options = { clear: false, bold: false }) {
    if (options.clear) this.messageArea.innerHTML = '';

    const msgElement = document.createElement('p');
    msgElement.innerText = msg;

    if (options.bold) msgElement.classList.add('bold');

    this.messageArea.prepend(msgElement);
  }

  updateSquare(square, player, hit = false) {
    if (hit) {
      square.classList.add('hit');
      this.showMessage(`✅ ${player.name} Hit!`);
    } else {
      square.classList.add('miss');
      this.showMessage(`❌ ${player.name} Miss`);
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

        if (board.shipAt([j, i]) === 'hit') {
          square.classList.add('hit');
        } else if (board.shipAt([j, i]) === 'miss') {
          square.classList.add('miss');
        }

        if (
          !interactive &&
          typeof board.shipAt([j, i]) === 'object' &&
          board.shipAt([j, i]) !== null
        ) {
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

  changeTurns() {
    this.changeTurnScreen.showModal();
    return new Promise((resolve) => {
      this.changeTurnCallback = resolve;
    });
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
