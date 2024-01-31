import Ship from './Ship.js';

export default class GameController {
  constructor(p1, p2, domController) {
    this.player1 = p1;
    this.player2 = p2;
    this.dom = domController;
    this.inProgress = false;
    this.placementPhase = false;
  }

  init() {
    this.placementPhase = true;
    this.shipsToPlace = [
      new Ship({ length: 2 }),
      new Ship({ length: 3 }),
      new Ship({ length: 3 }),
      new Ship({ length: 4 }),
      new Ship({ length: 5 }),
    ];
    this.dom.showMessage('Place ship.');
    document
      .querySelector('.boards')
      .append(this.dom.drawBoard(this.player1.board));
  }

  startGame() {
    this.placementPhase = false;
    this.inProgress = true;
    this.dom.startGame();
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

    try {
      this.player1.board.placeShip(this.shipsToPlace.pop(), [coordX, coordY]);
      if (this.shipsToPlace.length === 0) {
        this.startGame();
      } else {
        this.dom.clearMessage();
        this.dom.showMessage('Place next ship.');
      }
    } catch {
      this.dome.clearMessage();
      this.dom.showMessage('Invalid placement.');
    }
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
