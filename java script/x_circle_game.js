const gameBoard = document.getElementById('game-board');
let currentPlayer = 'X';
let gameBoardArray = ['', '', '', '', '', '', '', '', ''];
let gameEnded = false;

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', handleClick);
    gameBoard.appendChild(cell);
  }
}

function handleClick(event) {
  if (gameEnded) return; 

  const cell = event.target;
  const index = cell.dataset.index;

  if (gameBoardArray[index] !== '') return;

  gameBoardArray[index] = currentPlayer;
  cell.textContent = currentPlayer;


if (checkWin()) {
    gameEnded = true; 
    setTimeout(() => {
        showAlert(`${currentPlayer} Won!`);
      resetGame();
    }, 500);
  } else if (isBoardFull()) {
    gameEnded = true;
    setTimeout(() => {
      showAlert('Game over');
      resetGame();
    }, 500);
  
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

function checkWin() {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6] 
  ];

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (
      gameBoardArray[a] &&
      gameBoardArray[a] === gameBoardArray[b] &&
      gameBoardArray[a] === gameBoardArray[c]
    ) {
      highlightWinningCells(condition); 
      return true;
    }
  }

  return false;
}

function showAlert(message) {
    const alertBox = document.getElementById("custom-alert");
    const alertMessage = document.getElementById("alert-message");
  
    alertMessage.textContent = message; 
    alertBox.classList.remove("hidden"); 
  }
  
  function closeAlert() {
    const alertBox = document.getElementById("custom-alert");
    alertBox.classList.add("hidden"); 
  }



function highlightWinningCells(condition) {
  const cells = document.querySelectorAll('.cell');
  condition.forEach(index => {
    cells[index].classList.add('highlight'); 
  });
}

function isBoardFull() {
  return gameBoardArray.every(cell => cell !== '');
}

function resetGame() {
  gameBoardArray = ['', '', '', '', '', '', '', '', ''];
  gameEnded = false;
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('highlight'); 
  });
}


createBoard();