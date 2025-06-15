const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const resetButton = document.getElementById("reset");
const singlePlayerButton = document.getElementById("singlePlayer");
const multiPlayerButton = document.getElementById("multiPlayer");

let currentPlayer = "✅";
let gameActive = false;
let boardState = ["", "", "", "", "", "", "", "", ""];
let aiMode = false;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

// Start multiplayer mode
multiPlayerButton.addEventListener("click", () => {
    resetGame();
    aiMode = false;
    gameActive = true;
});

// Start single-player mode
singlePlayerButton.addEventListener("click", () => {
    resetGame();
    aiMode = true;
    gameActive = true;
});

// Handle click on a cell
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.getAttribute("data-index");
        if (boardState[index] === "" && gameActive) {
            boardState[index] = currentPlayer;
            cell.innerText = currentPlayer;
            playSound("click");

            if (checkWin()) {
                endGame(`${currentPlayer} wins!`);
                return;
            } else if (!boardState.includes("")) {
                endGame("It's a draw!");
                return;
            }

            currentPlayer = currentPlayer === "✅" ? "❌" : "✅";

            if (aiMode && currentPlayer === "❌") {
                setTimeout(aiMove, 500);
            }
        }
    });
});

// AI makes a random move
function aiMove() {
    let emptyCells = boardState.map((val, idx) => (val === "" ? idx : null)).filter(val => val !== null);
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    boardState[randomIndex] = "❌";
    cells[randomIndex].innerText = "❌";
    playSound("click");

    if (checkWin()) {
        endGame("AI (❌) wins!");
        return;
    }

    currentPlayer = "✅";
}

// Check for a win
function checkWin() {
    return winPatterns.some(pattern => {
        let [a, b, c] = pattern;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            cells[a].classList.add("win");
            cells[b].classList.add("win");
            cells[c].classList.add("win");
            return true;
        }
        return false;
    });
}

// End the game
function endGame(message) {
    gameActive = false;
    status.innerText = message;
    playSound("win");
}

// Reset the game
resetButton.addEventListener("click", resetGame);

function resetGame() {
    boardState.fill("");
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove("win");
    });
    status.innerText = "";
    currentPlayer = "✅";
    gameActive = false;
}

// Sound effects
function playSound(type) {
    let audio = new Audio(type === "click" ? "click.mp3" : "win.mp3");
    audio.play();
}
