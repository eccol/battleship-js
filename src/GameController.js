export default class GameController {
  constructor(p1, p2, domController) {
    this.player1 = p1;
    this.player2 = p2;
    this.currentPlayer = this.player1;
    this.currentEnemy = this.player2;
    this.dom = domController;
    this.placementDirection = 'h';
    this.placementPhase = false;
  }

  async init() {
    this.placementPhase = true;
    await this.placementLoop();
    this.changeTurn();
    await this.placementLoop();

    this.placementPhase = false;
    this.dom.drawBoard(this.player2.board, 'main');
    this.dom.drawBoard(this.player1.board, 'side', false);
    this.dom.showMessage('💣 Start!', { clear: true });

    while (!this.isGameOver()) {
      this.changeTurn();
      await this.gameLoop();
    }
    this.dom.showMessage(`👑 ${this.getWinner().name} wins!`, { bold: true });
  }

  async placementLoop() {
    this.dom.drawBoard(this.currentPlayer.board, 'main');
    while (this.currentPlayer.nextShip() !== undefined) {
      this.dom.showMessage(`Place ${this.currentPlayer.nextShip().name}`);
      const move = await this.currentPlayer.getMove();
      const dir = this.currentPlayer.getDirection() ?? this.placementDirection;
      try {
        this.currentPlayer.placeShip(move, dir);
        this.dom.setPlacement();
      } catch {
        this.dom.showMessage('Invalid placement');
      }
    }
  }

  async gameLoop() {
    const move = await this.currentPlayer.getMove();
    let report;
    try {
      report = this.currentPlayer.attack(move);
    } catch {
      this.dom.showMessage('Invalid move');
      return;
    }

    // FIXME: This CPU check will become obsolete when 2 player mode is implemented
    const targetBoard = this.currentPlayer.isCPU ? 'side' : 'main';
    const square = this.dom.getSquareByCoordinates(move, targetBoard);
    this.dom.updateSquare(square, this.currentPlayer, report.hit);
    if (report.hit && report.ship.isSunk()) {
      this.dom.showMessage(
        `🌊 ${this.currentEnemy.name}'s ${report.ship.name} sunk!`,
        { bold: true },
      );
    }
  }

  handleInput(event) {
    const square = event.target;
    const coordinates = square.dataset.position
      .split(',')
      .map((x) => Number(x));
    this.currentPlayer.resolveCallback(coordinates);
    return;
  }

  isGameOver() {
    if (this.getWinner() !== null) {
      return true;
    }
    return false;
  }

  nextShipLength() {
    if (this.currentPlayer.nextShip()) {
      return this.currentPlayer.nextShip().length;
    }
    return 0;
  }

  togglePlacementDirection() {
    if (this.placementDirection === 'h') {
      this.placementDirection = 'v';
    } else {
      this.placementDirection = 'h';
    }
  }

  changeTurn() {
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
      this.currentEnemy = this.player1;
    } else {
      this.currentPlayer = this.player1;
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
