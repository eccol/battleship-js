import Gameboard from './Gameboard.js';
import { Player, CPUPlayer } from './Player.js';
import Ship from './Ship.js';
import './style.scss';

// Inits
const playerBoard = new Gameboard(10, 10);
const cpuBoard = new Gameboard(10, 10);
const player = new Player({ board: playerBoard, enemyBoard: cpuBoard });
const cpu = new CPUPlayer({ board: cpuBoard, enemyBoard: playerBoard });

// Placeholder ship placements
for (const board of [playerBoard, cpuBoard]) {
  board.placeShip(new Ship({ length: 2 }), [1, 1]);
  board.placeShip(new Ship({ length: 5 }), [3, 4]);
}

// Generate board on DOM
function drawBoard(board, reveal = false) {
  const container = document.createElement('div');
  container.classList.add('board-container');
  for (let i = 0; i < board.xLength; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < board.yLength; j++) {
      const square = document.createElement('div');
      square.classList.add('square');
      if (reveal && board.shipAt([i, j]) !== null) {
        square.classList.add('ship');
      }
      row.appendChild(square);
    }
    container.appendChild(row);
  }
  return container;
}

const enemyBoardGrid = drawBoard(cpuBoard);
document.querySelector('.boards').appendChild(enemyBoardGrid);
const playerBoardGrid = drawBoard(playerBoard, true);
document.querySelector('.boards').appendChild(playerBoardGrid);
