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

  it('returns true if hit', () => {
    const board = new Gameboard(10, 10);
    board.placeShip(new Ship({ length: 2 }), [1, 1]);
    const player = new Player({ enemyBoard: board });
    expect(player.attack([1, 1])).toBe(true);
  });

  it('returns false if miss', () => {
    const board = new Gameboard(10, 10);
    const player = new Player({ enemyBoard: board });
    expect(player.attack([9, 9])).toBe(false);
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
