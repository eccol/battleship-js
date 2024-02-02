export default class Ship {
  constructor(args) {
    this.length = args.length;
    this.name = args.name;
    this.hits = 0;
  }

  hit() {
    if (this.isSunk()) {
      throw new Error('Ship already sunk');
    }
    this.hits += 1;
  }

  isSunk() {
    return this.hits === this.length;
  }
}
