export default class Gameboard {
  constructor(x, y) {
    this.xLength = x;
    this.yLength = y;
    this.board = [];

    for (let i = 0; i < x; i++) {
      const row = [];
      for (let j = 0; j < y; j++) {
        row.push(null);
      }
      this.board.push(row);
    }
  }

  placeShip(ship, coords, direction = 'h') {
    const x = coords[0];
    const y = coords[1];
    const length = ship.length;

    if (direction === 'h') {
      if (x + length > this.xLength) throw new Error('Out of bounds');
      for (let i = x; i < x + length; i++) {
        this.board[i][y] = ship;
      }
    } else if (direction === 'v') {
      if (y + length > this.yLength) throw new Error('Out of bounds');
      for (let i = y; i < y + length; i++) {
        this.board[x][i] = ship;
      }
    } else {
      throw new Error('Invalid direction');
    }
  }

  shipAt(coords) {
    return this.board[coords[0]][coords[1]];
  }
}