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
function drawBoard(board, self = false) {
  const container = document.createElement('div');
  container.classList.add('board-container');

  for (let i = 0; i < board.xLength; i++) {
    const row = document.createElement('div');
    row.classList.add('row');

    for (let j = 0; j < board.yLength; j++) {
      const square = document.createElement('div');
      square.classList.add('square');
      if (self) square.dataset.position = `${i},${j}`;

      if (self && board.shipAt([i, j]) !== null) {
        square.classList.add('ship');
      }

      square.addEventListener('click', () => {
        if (!self && !isGameOver() && !board.wasAlreadyGuessed([i, j])) {
          if (player.attack([i, j])) {
            square.classList.add('hit');
          } else {
            square.classList.add('miss');
          }
          makeCPUMove();
        }
      });

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

// Game loop
function isGameOver() {
  return player.isWinner() || cpu.isWinner();
}

function makeCPUMove() {
  const move = cpu.getMove();
  const targetSquare = document.querySelector(
    `[data-position="${move[0]},${move[1]}`,
  );
  const result = cpu.attack(move);
  if (result === true) {
    targetSquare.classList.add('hit');
  } else {
    targetSquare.classList.add('miss');
  }
}
