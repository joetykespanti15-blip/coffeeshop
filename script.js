// --- NAVBAR LOGIC ---
const burger = document.getElementById('burger');
const nav = document.getElementById('navLinks');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
});

// --- 2D GAME LOGIC (Barista Catch) ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const overlay = document.getElementById('gameOverlay');
const scoreDisplay = document.getElementById('scoreBoard');

canvas.width = 600;
canvas.height = 400;

let score = 0;
let gameActive = false;
let items = [];
let frameCount = 0;

const player = {
    x: 260,
    y: 350,
    width: 80,
    height: 40
};

// Controls
function movePlayer(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    player.x = (x * canvas.width / rect.width) - player.width / 2;
}
canvas.addEventListener('mousemove', movePlayer);
canvas.addEventListener('touchmove', (e) => { movePlayer(e); e.preventDefault(); }, {passive: false});

function spawnItem() {
    const icons = ['☕', '🫘', '🥐', '🍩'];
    items.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        speed: 3 + Math.random() * 2,
        content: icons[Math.floor(Math.random() * icons.length)]
    });
}

function draw() {
    if (!gameActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Mug (Player)
    ctx.fillStyle = "#d7ccc8";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "#3e2723";
    ctx.font = "12px Arial";
    ctx.fillText("BREW MUG", player.x + 10, player.y + 25);

    // Update & Draw Items
    ctx.font = "30px Arial";
    items.forEach((item, i) => {
        item.y += item.speed;
        ctx.fillText(item.content, item.x, item.y);

        // Catch check
        if (item.y > player.y && item.x > player.x && item.x < player.x + player.width) {
            items.splice(i, 1);
            score += 10;
            scoreDisplay.innerText = `Score: ${score}`;
        }

        // Drop check (Game Over)
        if (item.y > canvas.height) {
            gameOver();
        }
    });

    frameCount++;
    if (frameCount % 50 === 0) spawnItem();
    requestAnimationFrame(draw);
}

function startGame() {
    score = 0;
    items = [];
    gameActive = true;
    overlay.style.display = 'none';
    draw();
}

function gameOver() {
    gameActive = false;
    overlay.style.display = 'flex';
    overlay.innerHTML = `<div style="color:white"><h2>Spilled!</h2><p>Score: ${score}</p><button onclick="startGame()" class="btn">Restart</button></div>`;
}

startBtn.addEventListener('click', startGame);