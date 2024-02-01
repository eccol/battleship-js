export class Player {
  constructor(args) {
    this.name = args.name;
    this.enemyBoard = args.enemyBoard;
    this.board = args.board;
    this.ships = args.ships;
    this.guesses = [];
  }

  attack(coords) {
    return this.enemyBoard.receiveAttack(coords);
  }

  isWinner() {
    return this.enemyBoard.areAllSunk();
  }
}

export class CPUPlayer extends Player {
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
      if (!this.enemyBoard.wasAlreadyGuessed(coordinate)) moveFound = true;
    }

    this.guesses.push(coordinate);
    return coordinate;
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
