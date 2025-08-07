const o = null

const grid = [
    [1,1,1,1,1,1,1, 1,1,1,1,1,1,1, 1,1,1,1,1,1,1, 1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2, 2,2,2,2,2,2,1, 1,2,2,2,2,2,2, 2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2, 1,1,1,1,1,2,1, 1,2,1,1,1,1,1, 2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2, 1,1,1,1,1,2,1, 1,2,1,1,1,1,1, 2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2, 1,1,1,1,1,2,1, 1,2,1,1,1,1,1, 2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2, 2,2,2,2,2,2,2, 2,2,2,2,2,2,2, 2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2, 1,1,2,1,1,1,1, 1,1,1,1,2,1,1, 2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2, 1,1,2,1,1,1,1, 1,1,1,1,2,1,1, 2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2, 1,1,2,2,2,2,1, 1,2,2,2,2,1,1, 2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2, 1,1,1,1,1,0,1, 1,0,1,1,1,1,1, 2,1,1,1,1,1,1],
    [o,o,o,o,o,1,2, 1,1,1,1,1,0,1, 1,0,1,1,1,1,1, 2,1,o,o,o,o,o],
    [o,o,o,o,o,1,2, 1,1,0,0,0,0,0, 0,0,0,0,0,1,1, 2,1,o,o,o,o,o],
    [o,o,o,o,o,1,2, 1,1,0,1,1,1,0, 0,1,1,1,0,1,1, 2,1,o,o,o,o,o],
    [1,1,1,1,1,1,2, 1,1,0,1,o,o,o, o,o,o,1,0,1,1, 2,1,1,1,1,1,1],
    [0,0,0,0,0,0,2, 0,0,0,1,o,o,o, o,o,o,1,0,0,0, 2,0,0,0,0,0,0],
    [1,1,1,1,1,1,2, 1,1,0,1,o,o,o, o,o,o,1,0,1,1, 2,1,1,1,1,1,1],
    [o,o,o,o,o,1,2, 1,1,0,1,1,1,1, 1,1,1,1,0,1,1, 2,1,o,o,o,o,o],
    [o,o,o,o,o,1,2, 1,1,0,0,0,0,0, 0,0,0,0,0,1,1, 2,1,o,o,o,o,o],
    [o,o,o,o,o,1,2, 1,1,0,1,1,1,1, 1,1,1,1,0,1,1, 2,1,o,o,o,o,o],
    [1,1,1,1,1,1,2, 1,1,0,1,1,1,1, 1,1,1,1,0,1,1, 2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2, 2,2,2,2,2,2,1, 1,2,2,2,2,2,2, 2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2, 1,1,1,1,1,2,1, 1,2,1,1,1,1,1, 2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2, 1,1,1,1,1,2,1, 1,2,1,1,1,1,1, 2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2, 2,2,2,2,2,2,0, 0,2,2,2,2,2,2, 2,1,1,2,2,3,1],
    [1,1,1,2,1,1,2, 1,1,2,1,1,1,1, 1,1,1,1,2,1,1, 2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2, 1,1,2,1,1,1,1, 1,1,1,1,2,1,1, 2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2, 1,1,2,2,2,2,1, 1,2,2,2,2,1,1, 2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1, 1,1,1,1,1,2,1, 1,2,1,1,1,1,1, 1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1, 1,1,1,1,1,2,1, 1,2,1,1,1,1,1, 1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2, 2,2,2,2,2,2,2, 2,2,2,2,2,2,2, 2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1, 1,1,1,1,1,1,1, 1,1,1,1,1,1,1, 1,1,1,1,1,1,1],
];

const blocksize = 20,                               // 20;
    spacing = parseInt(blocksize / 4),              // interger blocksize / 2
    lineWidth = 2,                                  // 2
    foodsize = 2,                                   // 2
    bigfoodsize = 6,                                // 6
    cherrysize = 6,                                 // 6
    wallsize = blocksize - (spacing * 2),           // blocksize - ( spacing * 2)
    fps = 24,                                       // 24
    framerate = 1000 / fps,                         // 1000 / fps
    pacmanSpeed = parseInt(blocksize / 4),              // blocksize / 4
        ghostSpeed = parseInt(blocksize / 5),           // blocksize / 5
        ghostInjuredSpeed = parseInt(blocksize / 2);    // blocksize / 2

const gridSize = {
    width: grid[0].length,
    height: grid.length,
}

const windowSize = {
    width: grid[0].length * blocksize,
    height: grid.length * blocksize,
};

const DIRECTION_RIGHT = 0,
    DIRECTION_DOWN = 1,
    DIRECTION_LEFT = 2,
    DIRECTION_UP = 3;

const NULL = null,
    SPACE = 0,
    WALL = 1,
    FOOD = 2,
    BIGFOOD = 3
    CHERRY = 4;

const foodColor = "pink",
    wallColor = "blue",
    ghostAttackRadiusColor = "green";

const game = {
    PLAY: false,
    RESET: false,
    RESTART: false,
    QUIT: false,
    TIMER: 0,
}

const pacmanCONFIG = {
    speed: parseInt(blocksize / 4),
    position: { x: (13 * blocksize) + (2 * pacman.speed) },
    power: { ON: false, TIMER: 0 },
    life: 3,
};

const pacmanPOWER = {
    ON: false,
    TIMER: 0,
};

const pacmanPosition = {
    x: (13 * blocksize) + (2 * pacmanSpeed),
    y: 23 * blocksize,
};

const ghostCOLOR = {
    RED: "red",
    CYAN: "cyan",
    PINK: "pink",
    YELLOW: "yellow",
};

const quarter = {
    PINK: 0,
    RED: 1,
    YELLOW: 2,
    CYAN: 3,
}

const ghostsCONFIG = [
    {
        imageHealth: null,
        imageRetreat: null,
        imageInjure: null,
        position: { x: (13 * blocksize) + (2 * ghostSpeed), y: 11 * blocksize },
        direction: DIRECTION_RIGHT,
        color: ghostCOLOR.RED,
        scale: 1.5,
        idleRoute: [
            {x: 21 * blocksize, y: 1 * blocksize},
            {x: 26 * blocksize, y: 4 * blocksize},
            {x: 22 * blocksize, y: 5 * blocksize},
        ],
        injured: {
            HURT: false,
            SAFE: true,
            HOME: { x: 13 * blocksize, y: 14 * blocksize },
            SPEED: parseInt(blocksize / 2),
        },
        radarRadius: 10 * blocksize,
    },
    {
        imageHealth: null,
        imageRetreat: null,
        imageInjure: null,
        position: { x: (11 * blocksize) + (2 * ghostSpeed), y: 14 * blocksize },
        direction: DIRECTION_RIGHT,
        color: ghostCOLOR.CYAN,
        scale: 1.5,
        idleRoute: [
            {x: 21 * blocksize, y: 23 * blocksize},
            {x: 26 * blocksize, y: 29 * blocksize},
            {x: 15 * blocksize, y: 26 * blocksize},
        ],
        injured: {
            HURT: false,
            SAFE: true,
            HOME: { x: 11 * blocksize, y: 14 * blocksize },
            SPEED: parseInt(blocksize / 2),
        },
        radarRadius: 11 * blocksize,
    },
    {
        imageHealth: null,
        imageRetreat: null,
        imageInjure: null,
        position: { x: (13 * blocksize) + (2 * ghostSpeed), y: 14 * blocksize },
        direction: DIRECTION_LEFT,
        color: ghostCOLOR.PINK,
        scale: 1.5,
        idleRoute: [
            {x: 6 * blocksize, y: 1 * blocksize},
            {x: 1 * blocksize, y: 4 * blocksize},
            {x: 5 * blocksize, y: 5 * blocksize},
        ],
        injured: {
            HURT: false,
            SAFE: true,
            HOME: { x: 13 * blocksize, y: 14 * blocksize },
            SPEED: parseInt(blocksize / 2),
        },
        radarRadius: 12 * blocksize,
    },
    {
        imageHealth: null,
        imageRetreat: null,
        imageInjure: null,
        position: { x: (15 * blocksize) + (2 * ghostSpeed), y: 14 * blocksize },
        direction: DIRECTION_LEFT,
        color: ghostCOLOR.YELLOW,
        scale: 1.5,
        idleRoute: [
            {x: 6 * blocksize, y: 23 * blocksize},
            {x: 1 * blocksize, y: 29 * blocksize},
            {x: 12 * blocksize, y: 26 * blocksize},
        ],
        injured: {
            HURT: false,
            SAFE: true,
            HOME: { x: 15 * blocksize, y: 14 * blocksize },
            SPEED: parseInt(blocksize / 2),
        },
        radarRadius: 13 * blocksize,
    },
];
