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
const domController = new DOMController();
const game = new GameController(player, cpu, domController);
domController.setGame(game);

game.init();
