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
    if (this.currentPlayer.isCPU) this.dom.showMessage('CPU placing ships...');
    this.dom.drawBoard(this.currentPlayer.board, 'main');
    while (this.currentPlayer.nextShip() !== undefined) {
      if (!this.currentPlayer.isCPU)
        this.dom.showMessage(`Place ${this.currentPlayer.nextShip().name}`);
      const move = await this.currentPlayer.getMove();
      const dir = this.currentPlayer.getDirection() ?? this.placementDirection;
      try {
        this.currentPlayer.placeShip(move, dir);
        if (!this.currentPlayer.isCPU) this.dom.setPlacement();
      } catch {
        if (!this.currentPlayer.isCPU)
          this.dom.showMessage('Invalid placement');
      }
    }
  }

  async gameLoop() {
    let moveFound = false;
    let move;
    let report;

    while (!moveFound) {
      move = await this.currentPlayer.getMove();
      try {
        report = this.currentPlayer.attack(move);
        moveFound = true;
      } catch {
        this.dom.showMessage('Invalid move');
      }
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

    // Player.resolveCallback does not exist if it is the CPU's turn
    try {
      this.currentPlayer.resolveCallback(coordinates);
    } catch {
      console.warn('Too early, not your turn.');
    }
    return;
  }

  isGameOver() {
    if (this.getWinner() !== null) {
      return true;
    }
    return false;
  }

  nextShipLength() {
    if (this.currentPlayer.isCPU) return 0;
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
