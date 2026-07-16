const startScreen = document.getElementById("flapStart");
const canvas = document.getElementById("flappyBoard");
const cntx = canvas.getContext("2d");
const plScore = document.getElementById("pScore");
const aIScore = document.getElementById("aScore");
const goScreen = document.getElementById("divOver");
const winnerText = document.getElementById("flappyOver");
const gravity = 0.5;
const strength = -7;
const pipeWidth = 80;
const pipeGap = 200;
const pipeSpeed = 3;
let gameRunning = false;
let player = {
    x: 170,
    y: 260,
    radius: 15,
    velocity: 0,
    color: "yellow",
    score: 0,
    alive: true
};

let ai = {
    x: 170,
    y: 230,
    radius: 15,
    velocity: 0,
    color: "red",
    score: 0,
    alive: true
};
let pipes = [];
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && player.alive) {
        player.velocity = strength;
    }
});

function createPipe() {
    let topHeight = Math.random() * 250 + 50;
    pipes.push({
        x: canvas.width,
        width: pipeWidth,
        topHeight: topHeight,
        gap: pipeGap,
        passedPlayer: false,
        passedAI: false
    });
}
setInterval(() => {
    if (gameRunning) {
        createPipe();
    }
}, 2000);
function updateBird(bird) {
    bird.velocity += gravity;
    bird.y += bird.velocity;
    if (bird.y < 0 || bird.y > canvas.height) {
        bird.alive = false;
    }
}

function aiMove() {
    let nextPipe = pipes.find(pipe => pipe.x + pipe.width > ai.x);

    if (!nextPipe) {
        if (ai.y > canvas.height / 2) {
            ai.velocity = strength;
        }
        return;
    }

    let centerGap = nextPipe.topHeight + nextPipe.gap / 2;

    if (ai.y > centerGap) {
        ai.velocity = strength;
    }
}

function drawBird(bird) {
    cntx.beginPath();
    cntx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    cntx.fillStyle = bird.color;
    cntx.fill();
}

function drawPipes() {
    cntx.fillStyle = "green";

    pipes.forEach(pipe => {
        // Top pipe
        cntx.fillRect(
            pipe.x,
            0,
            pipe.width,
            pipe.topHeight
        );

        // Bottom pipe
        cntx.fillRect(
            pipe.x,
            pipe.topHeight + pipe.gap,
            pipe.width,
            canvas.height - (pipe.topHeight + pipe.gap)
        );
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        // Player score
        if (!pipe.passedPlayer && pipe.x + pipe.width < player.x) {
            pipe.passedPlayer = true;
            player.score++;
            plScore.textContent = player.score;
        }

        // Al score
        if (!pipe.passedAI && pipe.x + pipe.width < ai.x) {
            pipe.passedAI = true;
            ai.score++;
            aIScore.textContent = ai.score;

        }
    });

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function checkCollision(bird) {
    for (let pipe of pipes) {

        const hitsPipe =
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipe.width;

        if (hitsPipe) {

            const hitsTop =
                bird.y - bird.radius < pipe.topHeight;

            const hitsBottom =
                bird.y + bird.radius >
                pipe.topHeight + pipe.gap;

            if (hitsTop || hitsBottom) {
                bird.alive = false;

            }
        }
    }
}

function drawScores() {
    plScore.textContent = player.score;
    aIScore.textContent = ai.score;
}

function showGameOver() {

    gameRunning = false;

    let winner = "";

    if (!player.alive && !ai.alive) {
        if (player.score > ai.score) {
            winner = "🏆 You Win!";
        } else if (ai.score > player.score) {
            winner = "🤖 AI Wins!";
        } else {
            winner = "🤝 Draw!";
        }
    }
    else if (!player.alive) {
        winner = "🤖 AI Wins!";
    }
    else if (!ai.alive) {
        winner = "🏆 You Win!";
    }

    winnerText.textContent = winner;
    goScreen.classList.remove("hidden");
}

function animate() {

    if (!gameRunning) {
        return;
    }

    cntx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky background
    cntx.fillStyle = "#70c5ce";
    cntx.fillRect(0, 0, canvas.width, canvas.height);

    updateBird(player);
    updateBird(ai);

    aiMove();

    updatePipes();

    checkCollision(player);
    checkCollision(ai);

    drawPipes();

    drawBird(player);
    drawBird(ai);

    drawScores();

    if (!player.alive || !ai.alive) {
        showGameOver();
        return;
    }

    requestAnimationFrame(animate);
}

function restartGame() {

    player = {
        x: 170,
        y: 260,
        radius: 15,
        velocity: 0,
        color: "yellow",
        score: 0,
        alive: true
    };

    ai = {
        x: 170,
        y: 230,
        radius: 15,
        velocity: 0,
        color: "red",
        score: 0,
        alive: true
    };

    pipes = [];

    plScore.textContent = "0";
    aIScore.textContent = "0";

    gameRunning = true;

    goScreen.classList.add("hidden");

    animate();
}

function startGame() {
    startScreen.style.display = "none";
    gameRunning = true;
    //createPipe();
    animate();
}
