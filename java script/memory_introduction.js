

const players = [{ playerName: "Player 1", playerScore: 0 }, { playerName: "Player 2", playerScore: 0 }];

function updatePlayerNames() {
    const player1Name = document.getElementById("player1Name").value;
    const player2Name = document.getElementById("player2Name").value;

    players[0].playerName = player1Name || "Player 1";
    players[1].playerName = player2Name || "Player 2";

    localStorage.setItem('player1Name', players[0].playerName);
    localStorage.setItem('player2Name', players[1].playerName);
    window.location.href = 'memory_game.html'; // או שם הדף השני
}