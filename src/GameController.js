export default class GameController {
  constructor(p1, p2, domController) {
    this.player1 = p1;
    this.player2 = p2;
    this.currentTurn = this.player1;
    this.currentEnemy = this.player2;
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

  receiveInput(event) {
    const square = event.target;

    if (this.inProgress) this.handleAttack(square);
    else if (this.placementPhase) this.handlePlacement(square);
  }

  handlePlacement(square) {
    const coordinates = square.dataset.position.split(',');
    const placed = this.currentTurn.placeShip(
      coordinates,
      this.placementDirection,
    );

    if (placed) {
      if (this.currentTurn.nextShip() === undefined) {
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

    if (this.inProgress && !this.currentTurn.alreadyGuessed(coordinates)) {
      const report = this.currentTurn.attack(coordinates);
      this.dom.updateSquare(square, this.currentTurn, report.hit);
      if (report.hit && report.ship.isSunk()) {
        this.dom.showMessage(
          `${this.currentEnemy.name}'s ${report.ship.name} sunk!`,
          true,
        );
      }

      if (!this.isGameOver()) {
        this.changeTurn();
        if (this.currentTurn.isCPU) {
          console.log(this.player2.board.board);
          const move = this.currentTurn.getMove();
          const targetSquare = document.querySelector(
            `.side [data-position="${move[0]},${move[1]}`,
          );
          this.handleAttack(targetSquare);
          this.isGameOver();
        }
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

  changeTurn() {
    if (this.currentTurn === this.player1) {
      this.currentTurn = this.player2;
      this.currentEnemy = this.player1;
    } else {
      this.currentTurn = this.player1;
      this.currentEnemy = this.player2;
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
