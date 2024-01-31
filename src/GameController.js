export default class GameController {
  constructor(p1, p2) {
    this.player1 = p1;
    this.player2 = p2;
    this.inProgress = false;
  }

  init(domController) {
    this.dom = domController;
    this.inProgress = true;
    this.dom.showMessage('Start!');
  }

  isGameOver() {
    if (this.player1.isWinner() || this.player2.isWinner()) {
      this.inProgress = false;
      this.dom.showMessage('Game over.');
      return true;
    }
    return false;
  }

  makeCPUMove() {
    const move = this.player2.getMove();
    const targetSquare = document.querySelector(
      `.player [data-position="${move[0]},${move[1]}`,
    );
    const result = this.player2.attack(move);

    if (result === true) {
      targetSquare.classList.add('hit');
      this.dom.showMessage('Hit!');
    } else {
      targetSquare.classList.add('miss');
      this.dom.showMessage('Miss.');
    }
  }

  receiveInput(event) {
    const square = event.target;
    const coordinates = event.target.dataset.position.split(',');
    const coordX = Number(coordinates[0]);
    const coordY = Number(coordinates[1]);
    if (
      this.inProgress &&
      !this.player2.board.wasAlreadyGuessed([coordX, coordY])
    ) {
      this.dom.clearMessage();
      if (this.player1.attack([coordX, coordY])) {
        square.classList.add('hit');
        this.dom.showMessage('Hit!');
      } else {
        square.classList.add('miss');
        this.dom.showMessage('Miss.');
      }

      if (!this.isGameOver()) {
        this.makeCPUMove();
        this.isGameOver();
      }
    }
  }
}
