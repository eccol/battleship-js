import { Player, CPUPlayer } from '../src/Player.js';
import Ship from '../src/Ship.js';
import Gameboard from '../src/Gameboard.js';

describe('getMove', () => {
  it('generates valid attack as CPU', () => {
    const board = new Gameboard(10, 10);
    const cpu = new CPUPlayer({ enemyBoard: board });
    const move = cpu.getMove();
    const fn = () => board.receiveAttack(move);
    expect(fn).not.toThrow();
  });

  it('does not duplicate guesses as CPU', () => {
    const board = new Gameboard(1, 2);
    const cpu = new CPUPlayer({ enemyBoard: board });
    const fn = () => board.receiveAttack(cpu.getMove());
    fn();
    expect(fn).not.toThrow();
  });
});

describe('attack', () => {
  it('sends an attack to the enemy', () => {
    const spy = jest.spyOn(Gameboard.prototype, 'receiveAttack');
    const board = new Gameboard(10, 10);
    const player = new Player({ enemyBoard: board });
    player.attack([1, 1]);

    expect(spy).toHaveBeenCalledWith([1, 1]);
    spy.mockClear();
  });

  it('returns the DamageReport object', () => {
    const board = new Gameboard(10, 10);
    const ship = new Ship({ length: 2 });
    board.placeShip(ship, [1, 1]);
    const player = new Player({ enemyBoard: board });
    expect(player.attack([1, 1])).toEqual({ hit: true, ship: ship });
  });
});

describe('isWinner', () => {
  let board, player;

  beforeEach(() => {
    board = new Gameboard(10, 10);
    board.placeShip(new Ship({ length: 2 }), [1, 1]);
    player = new Player({ enemyBoard: board });
  });

  it('is true when enemy ships are all sunk', () => {
    board.receiveAttack([1, 1]);
    board.receiveAttack([2, 1]);
    expect(player.isWinner()).toBe(true);
  });

  it('is false when enemy ships are not sunk', () => {
    board.receiveAttack([1, 1]);
    expect(player.isWinner()).toBe(false);
  });
});

describe('nextShip', () => {
  it('returns a ship when ships are left in the queue', () => {
    const player = new Player({
      name: 'Player',
      board: new Gameboard(10, 10),
      enemyBoard: new Gameboard(10, 10),
      ships: [new Ship({ length: 3 }), new Ship({ length: 3 })],
    });
    expect(player.nextShip()).toEqual(new Ship({ length: 3 }));
  });

  it('returns undefined when all ships are placed', () => {
    const player = new Player({
      name: 'Player',
      board: new Gameboard(10, 10),
      enemyBoard: new Gameboard(10, 10),
      ships: [new Ship({ length: 3 })],
    });
    player.placeShip([1, 1], 'h');
    expect(player.nextShip()).toBe(undefined);
  });
});
