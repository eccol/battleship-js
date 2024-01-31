import GameController from './GameController.js';
import DOMController from './DOMController.js';
import Gameboard from './Gameboard.js';
import { Player, CPUPlayer } from './Player.js';
import Ship from './Ship.js';
import './style.scss';

// Inits
const playerBoard = new Gameboard(10, 10);
const cpuBoard = new Gameboard(10, 10);
const player = new Player({
  name: 'Player',
  board: playerBoard,
  enemyBoard: cpuBoard,
});
const cpu = new CPUPlayer({
  name: 'Computer',
  board: cpuBoard,
  enemyBoard: playerBoard,
});
const game = new GameController(player, cpu);
const domController = new DOMController();

// Placeholder ship placements
for (const board of [playerBoard, cpuBoard]) {
  board.placeShip(new Ship({ length: 2 }), [1, 1]);
  board.placeShip(new Ship({ length: 5 }), [3, 4]);
}

domController.init(game);
game.init(domController);
