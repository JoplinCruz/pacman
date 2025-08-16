
const pacmanImageRIGHT = document.getElementById("pacman-right");
const pacmanImageLEFT = document.getElementById("pacman-left");
const pacmanImageUP = document.getElementById("pacman-up");
const pacmanImageDOWN = document.getElementById("pacman-down");
const ghostRedIMG = document.getElementById("ghost-red");
const ghostCyanIMG = document.getElementById("ghost-cyan");
const ghostPinkIMG = document.getElementById("ghost-pink");
const ghostYellowIMG = document.getElementById("ghost-yellow");
const ghostRetreatIMG = document.getElementById("ghost-retreat");
const ghostInjuredIMG = document.getElementById("ghost-injured");
const cherryIconIMG = document.getElementById("cherry-icon");

const canvas = document.getElementById("canvas");
const screen = canvas.getContext("2d");

// this is unecessary, but i used for this time
const powerSETTINGS = {
    hero: {
        bigfood: { timer: new Chronos() },
        cherry: { timer: new Chronos() },
    },
    bigfood: {
        icon: null,
    },
    cherry: {
        coordinate: new Grid(17, 13),
        icon: cherryIconIMG,
        timer: new Chronos(),
    },
};

const display = {
    score: document.querySelector("#score-value"),
    highscore: document.querySelector("#best-score-value"),
    life: document.querySelector("#life"),
    cherry: document.querySelector("#cherry"),
    message: document.querySelector("#message"),
    pacmanIMG: `<img src="./src/images/pacman-life.png" width="${blocksize}"/>`,
    cherryIMG: `<img src="./src/images/cherry-image.png" width="${blocksize}"/>`,
};

const ghostsSETTINGS = [
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

const power = new Power(powerSETTINGS);
const game = new Chronos();
const score = new Score();
score.load();

const pacmanSETTINGS = {
    speed: Math.floor(blocksize / 4),
    position: new Vector((13 * blocksize) + (2 * pacmanSpeed), 23 * blocksize),
    score: score,
    power: { ON: false, TIMER: 0 },                                 // change to power object
    live: { LIFE: 3, DEATH: 0 },
    cherry: { ON: false, POWER: 0, COUNTDOWN: 30, COUNTER: 0 },     // remove this after
};

canvas.width = windowSize.width;
canvas.height = windowSize.height;

// insert power object into gameboard parameter
const gameboard = new Gameboard(
    canvas,
    screen,
    grid,
    display,
    score,
    game,
    power,
    blocksize,
    fps,
);

// insert power object into pacman parameters
const pacman = new Pacman(
    screen,
    [pacmanImageRIGHT, pacmanImageDOWN, pacmanImageLEFT, pacmanImageUP],
    pacmanSETTINGS.position,
    blocksize,
    blocksize,
    DIRECTION_RIGHT,
    pacmanSpeed,
    gameboard,
    score,
    power,
    pacmanSETTINGS.live,
    pacmanSETTINGS.cherry,
);

// insert the power object into ghost parameters too
const ghosts = [];
for (let soul of ghostsSETTINGS){
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
        gameboard,
        power
    );
    ghosts.push(ghost);
}



function runtime() {

    /** remove this block after  --------------------------------------------------------v */
    // if (pacmanSETTINGS.power.ON) {
    //     pacmanSETTINGS.power.TIMER--;
    //     pacmanSETTINGS.power.ON = pacmanSETTINGS.power.TIMER <= 0 ? false : pacmanSETTINGS.power.ON;
    // }
    
    // if (pacmanSETTINGS.cherry.ON) {
    //     pacmanSETTINGS.cherry.COUNTDOWN--;
    //     pacmanSETTINGS.cherry.ON = pacmanSETTINGS.cherry.COUNTDOWN <= 0 ? false : pacmanSETTINGS.ON;
    // }
    /** remove this block after  --------------------------------------------------------^ */

    // gameboard.setMessage("Are you Ready?");
    
    if (game.is_playing()) {
        game.runtime();
        power.runtime();
        pacman.runtime(); 
        gameboard.runtime();
    }
    
    gameboard.draw();
    pacman.draw();
    
    for (let ghost of ghosts) {
        if (game.is_playing()) ghost.runtime();
        ghost.draw();
    }

    if (game.round()) {
        score.save();
        pacman.reset();
        // gameboard.setCherryStartup();   // remove this after
        power.cleanCherrySettings();
        for (let ghost of ghosts) ghost.reset();
        game.round(false);
    }

    if (game.end()) {
        power.reset()
        gameboard.setDisplayMessage(true);
        gameboard.reset();              // remove cherry from this object
        game.end(false);
    }
}

window.addEventListener("keydown", (event) => {
    let keycode = event.code;

    let noPause = () => {
        if (!game.is_playing()) game.play();
        gameboard.setDisplayMessage(false);
    };

    if (keycode === "KeyP") game.is_playing() ? game.pause() : game.play();

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
