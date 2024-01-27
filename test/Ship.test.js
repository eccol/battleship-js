import Ship from '../src/Ship.js';

describe('hit', () => {
  it('gets hit', () => {
    const largeShip = new Ship({ length: 5 });
    const startingHits = largeShip.hits;
    largeShip.hit();
    const newHits = largeShip.hits;
    expect(newHits - startingHits).toBe(1);
  });

  it('cannot get hit if sunk', () => {
    const smallShip = new Ship({ length: 1 });
    smallShip.hit();
    expect(() => smallShip.hit()).toThrow('Ship already sunk');
  });
});

describe('isSunk', () => {
  it('is false when ship has hits remaining', () => {
    const largeShip = new Ship({ length: 5 });
    expect(largeShip.isSunk()).toBe(false);
  });

  it('is true when ship has no hits remaining', () => {
    const smallShip = new Ship({ length: 1 });
    smallShip.hit();
    expect(smallShip.isSunk()).toBe(true);
  });
});
