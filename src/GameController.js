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
      `[data-position="${move[0]},${move[1]}`,
    );
    const result = this.player2.attack(move);
    if (result === true) {
      targetSquare.classList.add('hit');
    } else {
      targetSquare.classList.add('miss');
    }
  }
}
