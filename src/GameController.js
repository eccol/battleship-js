export default class GameController {
  constructor(p1, p2, domController) {
    this.player1 = p1;
    this.player2 = p2;
    this.dom = domController;
    this.inProgress = false;
    this.placementPhase = false;
    this.placementDirection = 'h';
  }

  init() {
    this.placementPhase = true;
    this.player2.placeShips();
    this.dom.showMessage('Place ship.');
    this.dom.drawBoard(this.player1.board, 'main');
  }

  startGame() {
    this.placementPhase = false;
    this.inProgress = true;
    this.dom.startGame();
  }

  isGameOver() {
    const winner = this.getWinner();
    if (winner !== null) {
      this.inProgress = false;
      this.dom.showMessage(`${winner.name} wins!`);
      return true;
    }
    return false;
  }

  makeCPUMove() {
    const move = this.player2.getMove();
    const targetSquare = document.querySelector(
      `.side [data-position="${move[0]},${move[1]}`,
    );
    const result = this.player2.attack(move);

    this.dom.updateSquare(targetSquare, this.player2, result);
  }

  receiveInput(event) {
    const square = event.target;

    if (this.inProgress) this.handleAttack(square);
    else if (this.placementPhase) this.handlePlacement(square);
  }

  handlePlacement(square) {
    const coordinates = square.dataset.position.split(',');
    const placed = this.player1.placeShip(coordinates, this.placementDirection);

    if (placed) {
      if (this.player1.nextShip() === undefined) {
        this.startGame();
      } else {
        this.dom.setPlacement();
        this.dom.showMessage('Place next ship.');
      }
    } else {
      this.dom.showMessage('Invalid placement.');
    }
  }

  handleAttack(square) {
    const coordinates = square.dataset.position.split(',');
    const coordX = Number(coordinates[0]);
    const coordY = Number(coordinates[1]);

    this.dom.showMessage('');

    if (
      this.inProgress &&
      !this.player2.board.wasAlreadyGuessed([coordX, coordY])
    ) {
      const result = this.player1.attack([coordX, coordY]);
      this.dom.updateSquare(square, this.player1, result);

      if (!this.isGameOver()) {
        this.makeCPUMove();
        this.isGameOver();
      }
    }
  }

  nextShipLength() {
    return this.player1.nextShip().length;
  }

  togglePlacementDirection() {
    if (this.placementDirection === 'h') {
      this.placementDirection = 'v';
    } else {
      this.placementDirection = 'h';
    }
  }

  getWinner() {
    if (this.player1.isWinner()) {
      return this.player1;
    } else if (this.player2.isWinner()) {
      return this.player2;
    }
    return null;
  }
}
