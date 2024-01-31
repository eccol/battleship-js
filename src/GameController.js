export default class GameController {
  constructor(p1, p2) {
    this.player1 = p1;
    this.player2 = p2;
    this.inProgress = false;
  }

  init() {
    this.inProgress = true;
  }

  isGameOver() {
    return this.player1.isWinner() || this.player2.isWinner();
  }

  makeCPUMove() {
    const move = this.player2.getMove();
    const targetSquare = document.querySelector(
      `.player [data-position="${move[0]},${move[1]}`,
    );
    const result = this.player2.attack(move);
    if (result === true) {
      targetSquare.classList.add('hit');
    } else {
      targetSquare.classList.add('miss');
    }
  }

  receiveInput(event) {
    const square = event.target;
    const coordinates = event.target.dataset.position.split(',');
    const coordX = Number(coordinates[0]);
    const coordY = Number(coordinates[1]);
    if (
      !this.isGameOver() &&
      !this.player2.board.wasAlreadyGuessed([coordX, coordY])
    ) {
      if (this.player1.attack([coordX, coordY])) {
        square.classList.add('hit');
      } else {
        square.classList.add('miss');
      }
      this.makeCPUMove();
    }
  }
}
