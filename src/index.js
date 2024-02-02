import GameController from './GameController';
import DOMController from './DOMController';
import Gameboard from './Gameboard';
import { Player, CPUPlayer } from './Player';
import Ship from './Ship';
import './style.scss';
import { cloneDeep } from 'lodash';

const shipList = [
  new Ship({ length: 5, name: 'Ship 5' }),
  new Ship({ length: 4, name: 'Ship 4' }),
  new Ship({ length: 3, name: 'Ship 3-1' }),
  new Ship({ length: 3, name: 'Ship 3-2' }),
  new Ship({ length: 2, name: 'Ship 2' }),
];
const playerBoard = new Gameboard(10, 10);
const cpuBoard = new Gameboard(10, 10);
const player = new Player({
  name: 'Player',
  board: playerBoard,
  enemyBoard: cpuBoard,
  ships: cloneDeep(shipList),
});
const cpu = new CPUPlayer({
  name: 'Computer',
  board: cpuBoard,
  enemyBoard: playerBoard,
  ships: cloneDeep(shipList),
});

const domController = new DOMController();
const game = new GameController(player, cpu, domController, shipList);
domController.setGame(game);

game.init();
