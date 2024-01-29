export class Player {
  constructor(args) {
    this.enemyBoard = args.enemyBoard;
    this.board = args.board;
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
  getMove() {
    const xMax = this.enemyBoard.xLength;
    const yMax = this.enemyBoard.yLength;
    let randomX;
    let randomY;
    let moveFound = false;

    while (!moveFound) {
      randomX = Math.floor(Math.random() * xMax);
      randomY = Math.floor(Math.random() * yMax);
      if (!this.enemyBoard.wasAlreadyGuessed([randomX, randomY]))
        moveFound = true;
    }

    this.guesses.push([randomX, randomY]);
    return [randomX, randomY];
  }
}
