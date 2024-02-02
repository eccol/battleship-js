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
    this.currentTurn.placeShips();
    this.dom.showMessage('Place ship.');
    this.dom.drawBoard(this.currentTurn.board, 'main');

    // The goal is to remove these lines
    this.changeTurn();
    this.currentTurn.placeShips();
    this.changeTurn();
  }

  async startGame() {
    this.placementPhase = false;
    this.inProgress = true;
    this.dom.startGame();

    while (!this.isGameOver()) {
      await this.gameLoop();
    }
    this.inProgress = false;
    this.dom.showMessage(`${this.getWinner().name} wins!`);
  }

  async gameLoop() {
    const move = await this.currentTurn.getMove();
    let report;
    try {
      report = this.currentTurn.attack(move);
    } catch {
      this.dom.showMessage('Invalid move');
      return;
    }
    const targetBoard = this.currentTurn.isCPU ? 'side' : 'main';
    const square = this.dom.getSquareByCoordinates(move, targetBoard);
    this.dom.updateSquare(square, this.currentTurn, report.hit);
    if (report.hit && report.ship.isSunk()) {
      this.dom.showMessage(
        `${this.currentEnemy.name}'s ${report.ship.name} sunk!`,
        true,
      );
    }

    this.changeTurn();
  }

  isGameOver() {
    if (this.getWinner() !== null) {
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
    const coordinates = square.dataset.position
      .split(',')
      .map((x) => Number(x));
    this.currentTurn.resolveMove(coordinates);
    return;
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
