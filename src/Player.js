export class Player {
  constructor(args) {
    this.name = args.name;
    this.enemyBoard = args.enemyBoard;
    this.board = args.board;
    this.ships = args.ships;
    this.guesses = [];
    this.isCPU = false;
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

  getMove() {
    return new Promise((resolve) => {
      this.resolveMove = resolve;
    });
  }

  isWinner() {
    return this.enemyBoard.areAllSunk();
  }

  placeShips() {
    // For human players, this will be done via the DOM
    return null;
  }

  placeShip(coordinates, direction) {
    const coordX = Number(coordinates[0]);
    const coordY = Number(coordinates[1]);

    const ship = this.ships.shift();
    try {
      this.board.placeShip(ship, [coordX, coordY], direction);
      return true;
    } catch (e) {
      this.ships.unshift(ship);
      return false;
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

  getRandomCoordinate(xMax, yMax) {
    const randomX = Math.floor(Math.random() * xMax);
    const randomY = Math.floor(Math.random() * yMax);
    return [randomX, randomY];
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

  placeShips() {
    const shipsToPlace = this.ships;
    const xMax = this.enemyBoard.xLength;
    const yMax = this.enemyBoard.yLength;
    while (shipsToPlace.length > 0) {
      const coordinate = this.getRandomCoordinate(xMax, yMax);
      const ship = shipsToPlace.shift();
      let direction = Math.floor(Math.random() * 2);
      if (direction === 0) {
        direction = 'h';
      } else {
        direction = 'v';
      }
      try {
        this.board.placeShip(ship, coordinate, direction);
      } catch {
        shipsToPlace.unshift(ship);
      }
    }
  }
}
