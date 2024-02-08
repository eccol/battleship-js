export default class Gameboard {
  constructor(x, y) {
    this.xLength = x;
    this.yLength = y;
    this.board = [];
    this.misses = [];
    this.hits = [];

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
    const targetSquares = [];

    if (direction === 'h') {
      if (x + length > this.xLength) throw new Error('Out of bounds');
      for (let i = x; i < x + length; i++) {
        targetSquares.push([i, y]);
      }
    } else if (direction === 'v') {
      if (y + length > this.yLength) throw new Error('Out of bounds');
      for (let i = y; i < y + length; i++) {
        targetSquares.push([x, i]);
      }
    } else {
      throw new Error('Invalid direction');
    }

    if (targetSquares.some((sq) => this.board[sq[0]][sq[1]] !== null)) {
      throw new Error('Ship already present');
    }
    for (const sq of targetSquares) {
      this.board[sq[0]][sq[1]] = ship;
    }
  }

  shipAt(coords) {
    return this.board[coords[0]][coords[1]];
  }

  receiveAttack(coords) {
    if (this.wasAlreadyGuessed(coords)) throw new Error('Duplicate guess');

    const target = this.shipAt(coords);
    if (typeof target === 'object' && target !== null) {
      target.hit();
      this.board[coords[0]][coords[1]] = 'hit';
      this.hits.push(coords);
      return new DamageReport(true, target);
    } else {
      this.board[coords[0]][coords[1]] = 'miss';
      this.misses.push(coords);
      return new DamageReport(false, null);
    }
  }

  wasAlreadyGuessed(coords) {
    return this.wasMissed(coords) || this.wasHit(coords);
  }

  wasHit(coords) {
    return this.hits.some((arr) => arr.every((v, i) => v === coords[i]));
  }

  wasMissed(coords) {
    return this.misses.some((arr) => arr.every((v, i) => v === coords[i]));
  }

  areAllSunk() {
    for (let i = 0; i < this.xLength; i++) {
      for (let j = 0; j < this.yLength; j++) {
        const target = this.shipAt([i, j]);
        if (typeof target === 'object' && target !== null && !target.isSunk())
          return false;
      }
    }
    return true;
  }
}

class DamageReport {
  constructor(hit, ship) {
    this.hit = hit;
    this.ship = ship;
  }
}
