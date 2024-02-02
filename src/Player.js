export class Player {
  constructor(args) {
    this.name = args.name;
    this.enemyBoard = args.enemyBoard;
    this.board = args.board;
    this.ships = args.ships;
    this.guesses = [];
    this.isCPU = false;
    this.resolveCallback = null;
  }

  getMove() {
    return new Promise((resolve) => {
      this.resolveCallback = resolve;
    });
  }

  getDirection() {
    // For human players, this will be determined by the
    // placementDirection variable in GameController
    return null;
  }

  alreadyGuessed(coordinate) {
    return this.guesses.some(
      // Stringify arrays in order to compare values instead of objects
      (guess) => JSON.stringify(guess) === JSON.stringify(coordinate),
    );
  }

  attack(coords) {
    this.guesses.push(coords);
    return this.enemyBoard.receiveAttack(coords);
  }

  isWinner() {
    return this.enemyBoard.areAllSunk();
  }

  placeShip(coordinates, direction) {
    const ship = this.ships.shift();
    try {
      this.board.placeShip(ship, coordinates, direction);
      return true;
    } catch (e) {
      this.ships.unshift(ship);
      throw e;
    }
  }

  nextShip() {
    return this.ships[0];
  }
}

export class CPUPlayer extends Player {
  constructor(args) {
    super(args);
    this.isCPU = true;
  }

  getMove() {
    const xMax = this.enemyBoard.xLength;
    const yMax = this.enemyBoard.yLength;
    let moveFound = false;
    let coordinate;

    while (!moveFound) {
      coordinate = this.getRandomCoordinate(xMax, yMax);
      if (!this.alreadyGuessed(coordinate)) moveFound = true;
    }

    this.guesses.push(coordinate);
    return Promise.resolve(coordinate);
  }

  getRandomCoordinate(xMax, yMax) {
    const randomX = Math.floor(Math.random() * xMax);
    const randomY = Math.floor(Math.random() * yMax);
    return [randomX, randomY];
  }

  getDirection() {
    let direction = Math.floor(Math.random() * 2);
    if (direction === 0) {
      direction = 'h';
    } else {
      direction = 'v';
    }
    return direction;
  }
}
