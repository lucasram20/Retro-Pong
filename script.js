const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const playBtn = document.getElementById('playBtn');
const quitBtn = document.getElementById('quitBtn');
const pauseMenu = document.getElementById('pauseMenu');
const resumeBtn = document.getElementById('resumeBtn');
const restartBtn = document.getElementById('restartBtn');
const quitPauseBtn = document.getElementById('quitPauseBtn');
const scoreboard = document.getElementById('scoreboard');

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
const ballSize = 10;

let paddle1Y = canvas.height / 2 - 50;
let paddle2Y = canvas.height / 2 - 50;
const paddleHeight = 100;
const paddleWidth = 10;
const paddleSpeed = 8;

let player1Score = 0;
let player2Score = 0;
const winningScore = 20;
let isPaused = false;

let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');
const winnerPopup = document.getElementById('winnerPopup');
const winnerText = document.getElementById('winnerText');
const newGameBtn = document.getElementById('newGameBtn');

function drawRect(x, y, width, height) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
}

function drawText(text, x, y) {
    ctx.fillStyle = '#fff';
    ctx.font = '30px Courier New';
    ctx.fillText(text, x, y);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    drawRect(0, paddle1Y, paddleWidth, paddleHeight);
    drawRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

    // Draw ball
    drawCircle(ballX, ballY, ballSize);

    // Draw scores
    drawText(player1Score, 100, 50);
    drawText(player2Score, canvas.width - 100, 50);

    // Draw center line
    for (let i = 0; i < canvas.height; i += 40) {
        drawRect(canvas.width / 2 - 1, i, 2, 20);
    }
}

function update() {
    if (isPaused) return;

    // Update paddle positions based on key presses
    if (wPressed && paddle1Y > 0) {
        paddle1Y -= paddleSpeed;
    }
    if (sPressed && paddle1Y < canvas.height - paddleHeight) {
        paddle1Y += paddleSpeed;
    }
    if (upPressed && paddle2Y > 0) {
        paddle2Y -= paddleSpeed;
    }
    if (downPressed && paddle2Y < canvas.height - paddleHeight) {
        paddle2Y += paddleSpeed;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (
        (ballX < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) ||
        (ballX > canvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds
    if (ballX < 0) {
        player2Score++;
        updateScoreboard();
        checkWinner();
        resetBall();
    } else if (ballX > canvas.width) {
        player1Score++;
        updateScoreboard();
        checkWinner();
        resetBall();
    }
}

function updateScoreboard() {
    player1ScoreElement.textContent = player1Score;
    player2ScoreElement.textContent = player2Score;
}

function checkWinner() {
    if (player1Score >= winningScore || player2Score >= winningScore) {
        const winner = player1Score >= winningScore ? "Player 1" : "Player 2";
        winnerText.textContent = `${winner} wins!`;
        winnerPopup.style.display = 'block';
        isPaused = true;
    }
}

function restartGame() {
    player1Score = 0;
    player2Score = 0;
    updateScoreboard();
    resetBall();
    paddle1Y = canvas.height / 2 - paddleHeight / 2;
    paddle2Y = canvas.height / 2 - paddleHeight / 2;
    winnerPopup.style.display = 'none';
    isPaused = false;
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = Math.random() > 0.5 ? 5 : -5;
}

function gameLoop() {
    update();
    draw();
    if (!isPaused) {
        requestAnimationFrame(gameLoop);
    }
}

function startGame() {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    scoreboard.style.display = 'block';
    isPaused = false;
    gameLoop();
}

function pauseGame() {
    isPaused = true;
    pauseMenu.style.display = 'block';
}

function resumeGame() {
    isPaused = false;
    pauseMenu.style.display = 'none';
    gameLoop();
}

function quitToMenu() {
    canvas.style.display = 'none';
    pauseMenu.style.display = 'none';
    winnerPopup.style.display = 'none';
    scoreboard.style.display = 'none';
    menu.style.display = 'block';
    restartGame();
}

playBtn.addEventListener('click', startGame);
quitBtn.addEventListener('click', quitToMenu);
resumeBtn.addEventListener('click', resumeGame);
restartBtn.addEventListener('click', () => {
    restartGame();
    resumeGame();
});
quitPauseBtn.addEventListener('click', quitToMenu);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
    if (e.key === 'w' || e.key === 'W') wPressed = true;
    if (e.key === 's' || e.key === 'S') sPressed = true;
    if (e.key === 'ArrowUp') upPressed = true;
    if (e.key === 'ArrowDown') downPressed = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W') wPressed = false;
    if (e.key === 's' || e.key === 'S') sPressed = false;
    if (e.key === 'ArrowUp') upPressed = false;
    if (e.key === 'ArrowDown') downPressed = false;
});

newGameBtn.addEventListener('click', () => {
    restartGame();
    resumeGame();
});