import Gameboard from '../src/Gameboard.js';
import Ship from '../src/Ship.js';

let gameboard;
let smallShip;
let largeShip;

beforeEach(() => {
  gameboard = new Gameboard(10, 10);
  smallShip = new Ship({ length: 2 });
  largeShip = new Ship({ length: 5 });
});

describe('placeShip', () => {
  it('places ships horizontally', () => {
    const coords = [1, 1];
    gameboard.placeShip(smallShip, coords);
    expect(gameboard.shipAt([2, 1])).toBe(smallShip);
  });

  it('places ships vertically', () => {
    const coords = [1, 1];
    gameboard.placeShip(smallShip, coords, 'v');
    expect(gameboard.shipAt([1, 2])).toBe(smallShip);
  });

  it('rejects unallowed directions', () => {
    const fn = () => gameboard.placeShip(smallShip, [1, 1], 'd');
    expect(fn).toThrow('Invalid direction');
  });

  it('does not place ships out of bounds', () => {
    const coords = [9, 9];
    expect(() => gameboard.placeShip(largeShip, coords)).toThrow(
      'Out of bounds',
    );
  });
});

describe('receiveAttack', () => {
  it('delivers hits to ships', () => {
    const coords = [1, 1];
    gameboard.placeShip(smallShip, coords);
    gameboard.receiveAttack([1, 1]);
    expect(smallShip.hits).toEqual(1);
  });

  it('records misses', () => {
    gameboard.placeShip(smallShip, [1, 1]);
    gameboard.receiveAttack([9, 9]);
    expect(gameboard.misses).toContainEqual([9, 9]);
  });

  it('does not deliver duplicate hits', () => {
    gameboard.placeShip(smallShip, [1, 1]);
    const fnHit = () => gameboard.receiveAttack([1, 1]);
    fnHit();
    expect(fnHit).toThrow('Duplicate guess');
  });

  it('does not allow duplicate misses', () => {
    const fnMiss = () => gameboard.receiveAttack([1, 1]);
    fnMiss();
    expect(fnMiss).toThrow('Duplicate guess');
  });
});
