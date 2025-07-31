
const pacmanIMG = document.getElementById("pacman");
const ghostRedIMG = document.getElementById("ghost-red");
const ghostCyanIMG = document.getElementById("ghost-cyan");
const ghostPinkIMG = document.getElementById("ghost-pink");
const ghostYellowIMG = document.getElementById("ghost-yellow");
const ghostRetreatIMG = document.getElementById("ghost-retreat");
const ghostInjuredIMG = document.getElementById("ghost-injured");

const ghostsIMG = [
    ghostRedIMG,
    ghostCyanIMG,
    ghostPinkIMG,
    ghostYellowIMG,
]

const canvas = document.getElementById("canvas");
const screen = canvas.getContext("2d");

canvas.width = windowSize.width;
canvas.height = windowSize.height;

const gameboard = new Grid(
    canvas,
    screen,
    grid
);

const pacman = new Pacman(
    screen,
    pacmanIMG,
    pacmanPosition,
    blocksize,
    blocksize,
    DIRECTION_RIGHT,
    speed
);

const ghosts = [];
for (let i = 0; i < ghostsIMG.length; i++){
    let ghost = new Ghost(
        screen,
        ghostsIMG[i], ghostRetreatIMG, ghostInjuredIMG,
        ghostsCONFIG[i].position,
        ghostsCONFIG[i].direction,
        blocksize, blocksize,
        ghostsCONFIG[i].scale,
        ghostSpeed,
        ghostsCONFIG[i].idleRoute,
        ghostsCONFIG[i].injuredTarget,
        ghostsCONFIG[i].radarRadius,
        ghostsCONFIG[i].color
    );
    ghosts.push(ghost);
}

function runtime() {

    if (game.PLAY) game.TIMER++;

    if (pacmanPOWER.ON) {
        pacmanPOWER.TIMER--;
        pacmanPOWER.ON = pacmanPOWER.TIMER <= 0 ? false : pacmanPOWER.ON;
    }

    gameboard.draw();
    
    if (game.PLAY) pacman.runtime();
    pacman.draw();
    
    for (let ghost of ghosts) {
        if (game.PLAY) ghost.runtime();
        ghost.draw();
    }

    if (game.RESET) {
        console.log("reset now...");
        pacman.reset();
        for (let ghost of ghosts) ghost.reset();
        game.RESET = false;
    }

}

window.addEventListener("keydown", (event) => {
    let keycode = event.code;

    let noPause = () => {
        if (!game.PLAY) game.PLAY = true;
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
