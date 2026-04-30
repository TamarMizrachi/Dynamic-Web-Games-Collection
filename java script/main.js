// הגדרת משתנים
let checkIfPair = 0;
let currentPlayerIndex = 0;
let alertText;
let openCards = [];
let startTime;
let gameTimer = 60;
let timerInterval;//לבדוק
// const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
const players = [{ playerName: "Player 1", playerScore: 0 }, { playerName: "Player 2", playerScore: 0 }];

//שליפת הכרטיסים ההפוכים
const crazyPicture = document.getElementById('crazy-picture');
const cryPicture = document.getElementById('cry-picture');
const loveCaption = document.getElementById('love-caption');
const lovePicture = document.getElementById('love-picture');
const crazyCaption = document.getElementById('crazy-caption');
const surprisedPicture = document.getElementById('surprised-picture');
const disappiontedPicture = document.getElementById('disappionted-picture');
const sadCaption = document.getElementById('sad-caption');
const surprisedCaption = document.getElementById('surprised-caption');
const sadPicture = document.getElementById('sad-picture');
const disappiontedCaption = document.getElementById('disappionted-caption');
const cryCaption = document.getElementById('cry-caption');

//מערך השמות המזהים של הכרטיסים
const cardHtml = [
    crazyPicture,
    cryPicture,
    loveCaption,
    lovePicture,
    crazyCaption,
    surprisedPicture, 
    disappiontedPicture, 
    sadCaption, 
    surprisedCaption,
    sadPicture, 
    disappiontedCaption, 
    cryCaption
];

//מערך המקורות
const memoryPictures = [
    "../memory-picturs/crazy picture.jpg",
    "../memory-picturs/cry picture.jpg",
    "../memory-picturs/love.png",
    "../memory-picturs/love picture.jpg",
    "../memory-picturs/crazy.png",
    "../memory-picturs/surprised picture.jpg",
    "../memory-picturs/dissapointed picture.jpg",
    "../memory-picturs/sad.png",
    "../memory-picturs/surprised.png",
    "../memory-picturs/sad picture.jpg",
    "../memory-picturs/disappointed.png",
    "../memory-picturs/cry.png"
];

//הצגת טבלת ניצחונות
function displayGameHistory(gameResult) {
    // טוען את המשתמש המחובר
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // טוען את היסטוריית המשחקים של המשתמש הנוכחי
    const gameHistory = currentUser?.gameHistory || [];

    // אם עדיין אין היסטוריה, להוסיף חדשה
    if (gameResult) {
        gameHistory.push(gameResult);
        currentUser.gameHistory = gameHistory;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }

    const gameHistoryDiv = document.getElementById('game_history');
    gameHistoryDiv.innerHTML = "";

    // יצירת טבלה אם יש נתונים
    if (gameHistory.length > 0) {
        const table = document.createElement('table');
        gameHistoryDiv.appendChild(table);

        const headerRow = table.insertRow();
        const headers = ["Winner", "Player 1", "Score", "Player 2", "Score", "Time (seconds)"];
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });

        gameHistory.forEach(game => {
            const row = table.insertRow();
            const cells = [game.winner, game.player1, game.player1Score, game.player2, game.player2Score, game.time];
            cells.forEach(cellText => {
                const cell = row.insertCell();
                cell.textContent = cellText;
            });
        });
    } else {
        gameHistoryDiv.innerHTML = "<p>No previous games</p>";
    }
}

// הוספת מאזין ללחיצה
document.getElementById("showHistoryButton").addEventListener("click", () => {
    displayGameHistory();
});


//השמעת צליל סיום המשחק
function playGameOverSound() {
    document.getElementById("gameOver_sound").play();
}

//מעדכנת את המסך כאשר נגמר המשחק
function checkGameOver() {
    //בדיקה האם כל הזוגות נמצאו
    const allPairsFound = cardHtml.every(card => card.classList.contains("pair"));

    if (allPairsFound) {
        let winner;
        if (players[0].playerScore > players[1].playerScore) {
            winner = players[0];
        } else if (players[1].playerScore > players[0].playerScore) {
            winner = players[1];
        } else {
            winner = "draw!";
        }
        playGameOverSound();

        const endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000;

        const gameResult = {
            winner: winner.playerName || winner,
            player1: players[0].playerName,
            player1Score: players[0].playerScore,
            player2: players[1].playerName,
            player2Score: players[1].playerScore,
            time: timeTaken
        };

        displayGameHistory(gameResult);

        alertText = `🏆Game Over!
        ${winner.playerName ? `Winner: ${winner.playerName}` : winner}
        ${players[0].playerName}: ${players[0].playerScore}
        ${players[1].playerName}: ${players[1].playerScore}`;
        showAlert(alertText);

        setTimeout(() => {
            location.reload();
        }, 5000);
    }
}

//והשמעת צליל מתאים למציאת זוג
function playMatchSound() {
    document.getElementById("match_sound").play();
}

//בדיקה האם הקלפים הפתוחים הם זוג
function checkPair() {
    if (openCards[0].name === openCards[1].name) {
        openCards.forEach(card => {
            card.classList.add("pair");
            card.classList.remove("card1", "card2");
        });

        players[currentPlayerIndex].playerScore += 20;
        openCards = [];
        checkIfPair = 1;
        playMatchSound();
        updateScoresAndPlayer(checkIfPair);
        checkGameOver();
    } else {
        setTimeout(() => {
            openCards.forEach(card => {
                card.src = "../memory-picturs/card.png";
            });
            openCards = [];
            checkIfPair = 0;
            updateScoresAndPlayer(checkIfPair);
        }, 1000);
    }
}

//פתיחת הכרטיסים המתאימים, ושליחת הזוג שנפתח לבדיקה
function openCard(cardIndex) {
    if (openCards.length >= 2) {
        return;
    }

    cardHtml[cardIndex].src = memoryPictures[cardIndex];
    openCards.push(cardHtml[cardIndex]);

    if (openCards.length === 2) {
        checkPair();
    }
}

//הצגת ההודעה המתאימה למשך שנייה וחצי
function showAlert(message) {
    const alertBox = document.getElementById("custom_alert");
    const alertMessage = document.getElementById("alert_message");

    alertMessage.textContent = message;
    alertBox.classList.remove("hidden");

    setTimeout(() => {
        alertBox.classList.add("hidden");
    }, 1500);
}

// עדכון מי השחקן הנוכחי ושליחת הודעה מתאימה 
function updateScoresAndPlayer(checkIfPair) {
    if (!checkIfPair) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }

    alertText = ` 
    Current player: ${players[currentPlayerIndex].playerName}
    ${players[0].playerName}: ${players[0].playerScore} 
    ${players[1].playerName}: ${players[1].playerScore}
    `;

    showAlert(alertText);
}

//הפעלת הטיימר
function startTimer() {
    const timerDisplay = document.getElementById("timer_display");

    if (!timerDisplay) {
        return;
    }

    timerInterval = setInterval(() => {
        if (gameTimer > 0) {
            gameTimer--;
            timerDisplay.textContent = `Time left: ${gameTimer} seconds`;
        } else {
            clearInterval(timerInterval);
            alertText = `Time is up!`;
            showAlert(alertText);
            startGame();
        }
    }, 1000);
}

//תחילת המשחק
function startGame() {
    checkIfPair = 0;
    updateScoresAndPlayer(checkIfPair);
    startTimer();
    cardHtml.forEach((card, index) => {
        card.addEventListener("click", () => openCard(index));
    });
}

// טעינת העמוד עם שמות השחקנים והפעלת המשחק
window.addEventListener('DOMContentLoaded', () => {
    const savedPlayer1Name = localStorage.getItem('player1Name');
    const savedPlayer2Name = localStorage.getItem('player2Name');

    if (savedPlayer1Name) {
        players[0].playerName = savedPlayer1Name;
    }
    if (savedPlayer2Name) {
        players[1].playerName = savedPlayer2Name;
    }

    startTime = new Date();
    startGame();
});






const gameBoard = document.getElementById('game-board');
let currentPlayer = 'X';
let gameBoardArray = ['', '', '', '', '', '', '', '', ''];
let gameEnded = false;

//יצירת לוח משחק
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
  // למנוע המשך משחק אם נגמר
  if (gameEnded) return; 

  const cell = event.target;
  const index = cell.dataset.index;

  if (gameBoardArray[index] !== '') return; 

  gameBoardArray[index] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWin()) {
    // המשחק נגמר כי יש ניצחון
    gameEnded = true; 
    setTimeout(() => {
      showAlert(`${currentPlayer} Won!`);
      resetGame();
    }, 500);
  } else if (isBoardFull()) {
    gameEnded = true;
    setTimeout(() => {
      showAlert('Game over!');
      resetGame();
    }, 500);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

function checkWin() {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // בודקת את השורות
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // בודקת את העמודות
    [0, 4, 8], [2, 4, 6] // בודקת אלכסון ראשי ואלכסון משני
  ];

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (
      gameBoardArray[a] &&
      gameBoardArray[a] === gameBoardArray[b] &&
      gameBoardArray[a] === gameBoardArray[c]
    ) {
      // צובע תאים תואמים
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
    // מסיר את ההדגשה
    cell.classList.remove('highlight'); 
  });
}

//תחילת המשחק
createBoard();

