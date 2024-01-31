export default class GameController {
  constructor(p1, p2, domController) {
    this.player1 = p1;
    this.player2 = p2;
    this.dom = domController;
    this.inProgress = false;
    this.placementPhase = true;
  }

  startGame() {
    this.placementPhase = false;
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

    this.dom.updateSquare(targetSquare, this.player2, result);
  }

  receiveInput(event) {
    const square = event.target;

    if (this.inProgress) this.handleAttack(square);
    else if (this.placementPhase) this.handlePlacement(square);
    else console.log('Game is over.');
  }

  handlePlacement(square) {
    const coordinates = square.dataset.position.split(',');
    const coordX = Number(coordinates[0]);
    const coordY = Number(coordinates[1]);

    // TODO
  }

  handleAttack(square) {
    const coordinates = square.dataset.position.split(',');
    const coordX = Number(coordinates[0]);
    const coordY = Number(coordinates[1]);

    if (
      this.inProgress &&
      !this.player2.board.wasAlreadyGuessed([coordX, coordY])
    ) {
      this.dom.clearMessage();
      const result = this.player1.attack([coordX, coordY]);
      this.dom.updateSquare(square, this.player1, result);

      if (!this.isGameOver()) {
        this.makeCPUMove();
        this.isGameOver();
      }
    }
  }
}
