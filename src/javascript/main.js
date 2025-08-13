
const pacmanIMG = document.getElementById("pacman");
const ghostRedIMG = document.getElementById("ghost-red");
const ghostCyanIMG = document.getElementById("ghost-cyan");
const ghostPinkIMG = document.getElementById("ghost-pink");
const ghostYellowIMG = document.getElementById("ghost-yellow");
const ghostRetreatIMG = document.getElementById("ghost-retreat");
const ghostInjuredIMG = document.getElementById("ghost-injured");

const canvas = document.getElementById("canvas");
const screen = canvas.getContext("2d");

const display = {
    score: document.querySelector("#score-value"),
    highscore: document.querySelector("#best-score-value"),
    life: document.querySelector("#life"),
    cherry: document.querySelector("#cherry"),
    message: document.querySelector("#message"),
    pacmanIMG: `<img src="./src/images/pacman-life.png" width="${blocksize}"/>`,
    cherryIMG: `<img src="./src/images/cherry-image.png" width="${blocksize}"/>`,
};

const ghostsCONFIG = [
    {
        imageHealth: ghostRedIMG,
        imageRetreat: ghostRetreatIMG,
        imageInjured: ghostInjuredIMG,
        position: new Vector((13 * blocksize) + (2 * ghostSpeed), 11 * blocksize),
        direction: DIRECTION_RIGHT,
        color: ghostCOLOR.RED,
        scale: 1.6,
        idleRoute: [
            new Vector(21 * blocksize, 1 * blocksize),
            new Vector(26 * blocksize, 4 * blocksize),
            new Vector(22 * blocksize, 5 * blocksize),
        ],
        injured: {
            HURT: false,
            SAFE: true,
            HOME: new Vector(13 * blocksize, 14 * blocksize),
            SPEED: parseInt(blocksize / 2),
        },
        radarRadius: 10 * blocksize,
    },
    {
        imageHealth: ghostCyanIMG,
        imageRetreat: ghostRetreatIMG,
        imageInjured: ghostInjuredIMG,
        position: new Vector(11 * blocksize, 14 * blocksize ),
        direction: DIRECTION_UP,
        color: ghostCOLOR.CYAN,
        scale: 1.6,
        idleRoute: [
            new Vector(21 * blocksize, 23 * blocksize),
            new Vector(26 * blocksize, 29 * blocksize),
            new Vector(15 * blocksize, 26 * blocksize),
        ],
        injured: {
            HURT: false,
            SAFE: true,
            HOME: new Vector(11 * blocksize, 14 * blocksize),
            SPEED: parseInt(blocksize / 2),
        },
        radarRadius: 11 * blocksize,
    },
    {
        imageHealth: ghostPinkIMG,
        imageRetreat: ghostRetreatIMG,
        imageInjured: ghostInjuredIMG,
        position: new Vector(13 * blocksize, 14 * blocksize ),
        direction: DIRECTION_DOWN,
        color: ghostCOLOR.PINK,
        scale: 1.6,
        idleRoute: [
            new Vector(6 * blocksize, 1 * blocksize),
            new Vector(1 * blocksize, 4 * blocksize),
            new Vector(5 * blocksize, 5 * blocksize),
        ],
        injured: {
            HURT: false,
            SAFE: true,
            HOME: new Vector(13 * blocksize, 14 * blocksize),
            SPEED: parseInt(blocksize / 2),
        },
        radarRadius: 12 * blocksize,
    },
    {
        imageHealth: ghostYellowIMG,
        imageRetreat: ghostRetreatIMG,
        imageInjured: ghostInjuredIMG,
        position: new Vector(15 * blocksize, 14 * blocksize),
        direction: DIRECTION_UP,
        color: ghostCOLOR.YELLOW,
        scale: 1.6,
        idleRoute: [
            new Vector(6 * blocksize, 23 * blocksize),
            new Vector(1 * blocksize, 29 * blocksize),
            new Vector(12 * blocksize, 26 * blocksize),
        ],
        injured: {
            HURT: false,
            SAFE: true,
            HOME: new Vector(15 * blocksize, 14 * blocksize),
            SPEED: parseInt(blocksize / 2),
        },
        radarRadius: 13 * blocksize,
    },
];

const highscore = Number(localStorage.getItem("highscore")) || 0;

const pacmanCONFIG = {
    speed: Math.floor(blocksize / 4),
    position: new Vector((13 * blocksize) + (2 * pacmanSpeed), 23 * blocksize),
    power: { ON: false, TIMER: 0 },
    score: { SCORE: 0, HIGH: highscore },
    live: { LIFE: 3, DEATH: 0 },
};

canvas.width = windowSize.width;
canvas.height = windowSize.height;

const gameboard = new Gameboard(
    canvas,
    screen,
    grid,
    display,
    blocksize,
);

const pacman = new Pacman(
    screen,
    pacmanIMG,
    pacmanCONFIG.position,
    blocksize,
    blocksize,
    DIRECTION_RIGHT,
    pacmanCONFIG.speed,
    gameboard,
    pacmanCONFIG.score,
    pacmanCONFIG.live,
);

const ghosts = [];
for (let soul of ghostsCONFIG){
    let ghost = new Ghost(
        screen,
        soul.imageHealth, soul.imageRetreat, soul.imageInjured,
        soul.position,
        soul.direction,
        blocksize, blocksize,
        soul.scale,
        ghostSpeed,
        soul.idleRoute,
        soul.injured,
        soul.radarRadius,
        soul.color,
        gameboard
    );
    ghosts.push(ghost);
}

function runtime() {

    if (game.PLAY) game.TIMER++;

    if (pacmanCONFIG.power.ON) {
        pacmanCONFIG.power.TIMER--;
        pacmanCONFIG.power.ON = pacmanCONFIG.power.TIMER <= 0 ? false : pacmanCONFIG.power.ON;
    }

    // gameboard.setMessage("Are you Ready?");
    gameboard.draw();
    
    if (game.PLAY) pacman.runtime();
    pacman.draw();
    
    for (let ghost of ghosts) {
        if (game.PLAY) ghost.runtime();
        ghost.draw();
    }

    if (game.RESET) {
        localStorage.setItem("highscore", String(pacman.score.HIGH))
        pacman.reset();
        for (let ghost of ghosts) ghost.reset();
        game.RESET = false;
    }

    if (game.RESTART) {
        gameboard.setDisplayMessage(true);
        gameboard.reset();
        game.RESTART = false;
    }

    if (pacman.score.SCORE > pacman.score.HIGH) pacman.score.HIGH = pacman.score.SCORE;
}

window.addEventListener("keydown", (event) => {
    let keycode = event.code;

    let noPause = () => {
        if (!game.PLAY) game.PLAY = true;
        gameboard.setDisplayMessage(false);
    };

    if (keycode === "KeyP")
        game.PLAY = !(game.PLAY);

    if (["KeyA", "ArrowLeft"].includes(keycode)) {
        pacman.changeDirection(DIRECTION_LEFT);
        noPause();
    }

    if (["KeyD", "ArrowRight"].includes(keycode)) {
        pacman.changeDirection(DIRECTION_RIGHT);
        noPause();
    }

    if (["KeyW", "ArrowUp"].includes(keycode)) {
        pacman.changeDirection(DIRECTION_UP);
        noPause();
    }

    if (["KeyS", "ArrowDown"].includes(keycode)) {
        pacman.changeDirection(DIRECTION_DOWN);
        noPause();
    }

});

setInterval(runtime, framerate);
