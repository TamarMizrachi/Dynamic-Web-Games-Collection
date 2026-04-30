// הגדרת משתנים
let checkIfPair = 0;
let alertText;
let openCards = [];
let currentPlayerIndex = 0;
const players = [{ playerName: "Player 1", playerScore: 0 }, { playerName: "Player 2", playerScore: 0 }];
let gameTimer = 60;
let timerInterval;
let startTime;
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
// let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
const cardHtml = [
    crazyPicture, cryPicture, loveCaption, lovePicture, crazyCaption,
    surprisedPicture, disappiontedPicture, sadCaption, surprisedCaption,
    sadPicture, disappiontedCaption, cryCaption
];

const memoryPictures = [
    "../files/memory-picturs/crazy-picture.jpg", "../files/memory-picturs/cry picture.jpg",
    "../files/memory-picturs/love.png", "../files/memory-picturs/love picture.jpg",
    "../files/memory-picturs/crazy.png", "../files/memory-picturs/suprised-picture.jpg",
    "../files/memory-picturs/dissapointed picture.jpg", "../files/memory-picturs/sad.png",
    "../files/memory-picturs/surprised.png", "../files/memory-picturs/sad picture.jpg",
    "../files/memory-picturs/disappointed.png", "../files/memory-picturs/cry.png"
];

//פונקציה לפתיחת כרטיס 
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

function showAlert(message) {
    const alertBox = document.getElementById("custom-alert");
    const alertMessage = document.getElementById("alert-message");

    alertMessage.textContent = message;
    alertBox.classList.remove("hidden");

    setTimeout(() => {
        alertBox.classList.add("hidden");
    }, 1500);
}

function checkPair() {
    if (openCards[0].name === openCards[1].name)
    {
        openCards[0].classList.add("pair");
        openCards[1].classList.add("pair");
        openCards[0].classList.remove("card1", "card2");
        openCards[1].classList.remove("card1", "card2");
        players[currentPlayerIndex].playerScore += 16.5;
        openCards = [];
        checkIfPair = 1;
        playMatchSound();
        updateScoresAndPlayer(checkIfPair);
        checkGameOver();
    } 
    else
    {
        setTimeout(() => {
            openCards.forEach(card => {
                card.src = "../files/memory-picturs/card.png";
            });
            openCards = [];
            checkIfPair = 0;
            updateScoresAndPlayer(checkIfPair);
        }, 1000);
    }
}

function checkGameOver() {
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

        gameHistory.push(gameResult);
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));

        displayGameHistory();

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

//הצגת לוח הניצחונות
function displayGameHistory() {
    const gameHistoryDiv = document.getElementById('gameHistory');
    gameHistoryDiv.innerHTML = '';

    if (gameHistory.length === 0) {
        gameHistoryDiv.innerHTML = "<p>No previous games.</p>";
        return;
    }

    const table = document.createElement('table');
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

    gameHistoryDiv.appendChild(table);
}

//הפעלת השמע המתאים
function playMatchSound() {
    document.getElementById("match-sound").play();
}

function playGameOverSound() {
    document.getElementById("game-over-sound").play();
}


//הפעלת הטיימר ועידכונו
function startTimer() {
    const timerDisplay = document.getElementById("timer-display");

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
            // checkGameOver();
            startGame();
        }
    }, 1000);
}


//הכנסת השמות למתחרים ושליחה לפונקציה המתחילה את המשחק
window.addEventListener('DOMContentLoaded', () => {
    const savedPlayer1Name = localStorage.getItem('player1Name');
    const savedPlayer2Name = localStorage.getItem('player2Name');

    if (savedPlayer1Name) {
        players[0].playerName = savedPlayer1Name;
    }
    if (savedPlayer2Name) {
        players[1].playerName = savedPlayer2Name;
    }

    displayGameHistory();

    startTime = new Date();
    startGame();
});
// תחילת המשחק
function startGame() {
    updateScoresAndPlayer(checkIfPair);
    startTimer();
    cardHtml.forEach((card, index) => {
        card.addEventListener("click", () => openCard(index));
    });
}

