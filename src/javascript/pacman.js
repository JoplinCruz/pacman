
class Pacman {

    /**
     * 
     * @param {HTMLCanvasElement} context 
     * @param {HTMLImageElement[]} image 
     * @param {Vector} position 
     * @param {number} width 
     * @param {number} height 
     * @param {number} direction 
     * @param {number} speed 
     * @param {Gameboard} gameboard 
     * @param {Score} score
     * @param {Power} power
     * @param {{LIFE: number, DEATH: number}} live
     * @param {{ON: boolean, POWER: number, COUNTDOWN: number, COUNTER: number}} cherry
     */
    constructor(context, image, position, width, height, direction, speed, gameboard, score, power, live, cherry) {
        this.screen = context;
        this.image = image;
        this.position = position;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.speed = speed;
        this.gameboard = gameboard;
        this.frameCount = 3;
        this.frameLength = 7;
        this.nextDirection = direction;
        this.score = score;
        this.power = power;
        this.ghost = 0;
        this.scale = 1.6;
        this.live = live;
        this.defaults();
    }

    defaults() {
        this.default = {
            position: {x: this.position.x, y: this.position.y},
            direction: this.direction,
            nextDirection: this.nextDirection,
            frameCount: this.frameCount,
            food: this.food,
            bigfood: this.bigfood,
            cherry: { ...this.cherry },
        }
    }

    reset() {
        this.position.change(this.default.position.x, this.default.position.y);
        this.direction = this.default.direction;
        this.nextDirection = this.default.nextDirection;
        this.frameCount = this.default.frameCount;
    }

    runtime() {
        this.frameCount = this.frameCount === this.frameLength - 1 ? 0 : this.frameCount + 1;
        this.live.LIFE = this.live.LIFE >= 7 ? 7 : this.live.LIFE;

        this.turnDirection();
        this.forward();
        if (this.collision())
            this.backward();
        this.ghostTouch();
        this.eat();
        this.checkDump();
        this.win();
    }

    move() {
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.position.right(this.speed);
                break;
            case DIRECTION_DOWN:
                this.position.down(this.speed);
                break;
            case DIRECTION_LEFT:
                this.position.left(this.speed);
                break;
            case DIRECTION_UP:
                this.position.up(this.speed);
        }
    }

    checkDump() {
        if (this.position.x > windowSize.width + this.width) this.position.x = -this.width;
        if (this.position.x < -this.width) this.position.x = windowSize.width + this.width;
        if (this.position.y > windowSize.height + this.height) this.position.y = -this.height;
        if (this.position.y < -this.height) this.position.y = windowSize.height + this.height;
    }
    
    forward() {
        this.speed = Math.abs(this.speed);
        this.move();
    }

    backward() {
        this.speed = -Math.abs(this.speed);
        this.move();
    }

    changeDirection(direction) {
        this.nextDirection = direction;
    }

    turnDirection() {
        if (this.position.checkGrid() || 
            this.direction % 2 === this.nextDirection % 2) {
            this.direction = this.isPossibleTurn() ? this.nextDirection : this.direction;
        }
    }

    isPossibleTurn() {

        let possibleDirection = this.position.grid.create();

        switch (this.nextDirection) {
            case DIRECTION_UP:
                possibleDirection.up();
                return !(this.collision(possibleDirection));
            case DIRECTION_DOWN:
                possibleDirection.down();
                return !(this.collision(possibleDirection));
            case DIRECTION_LEFT:
                possibleDirection.left();
                return !(this.collision(possibleDirection));
            case DIRECTION_RIGHT:
                possibleDirection.right();
                return !(this.collision(possibleDirection));
        }
    }

    collision(target) {
        if (!target)
            target = this.position.grid;

        return this.gameboard.collision(target.ceil()) === this.gameboard.WALL ||
            this.gameboard.collision(target.floor()) === this.gameboard.WALL
    }

    eat() {

        switch (this.gameboard.collision(this.position.grid.round())) {
            case this.gameboard.FOOD:
                this.eatFood();
                break;
            case this.gameboard.BIGFOOD:
                this.eatBigFood();
                break;
            case this.gameboard.CHERRY:
                this.eatCherry();
                break;
        }

    }

    eatFood() {
        this.gameboard.fill(this.position.grid.round(), this.gameboard.SPACE);
        this.score.score(1);
    }

    eatBigFood() {
        this.gameboard.fill(this.position.grid.round(), this.gameboard.SPACE);
        this.power.active_bigfood();
        this.score.score(10);
    }

    eatCherry() {
        if (this.power.is_cherry_power()) return;

        this.power.active_cherry();
        let power = this.power.getCherryPower();
        
        switch (power) {
            case this.power.cherry_power.LIFE:
                this.score.score(100);
                this.live.LIFE++;
                this.live.DEATH = 0;
                break;
            case this.power.cherry_power.INVISIBLE:
                break;
            case this.power.cherry_power.SPEED:
                break;
            case this.power.cherry_power.FREEZE:
                break;
        }
    }

    ghostTouch() {

        for (let ghost of ghostsSETTINGS) {

            if (this.position.collision(ghost.position) && !ghost.injured.HURT) {

                if (!this.power.is_bigfood_power()) {
                    this.live.LIFE = this.live.LIFE <= 0 ? 0 : --this.live.LIFE;
                    this.live.DEATH++;
                    game.round(true);
                    game.pause();
                    game.current(0);
                } else {
                    this.score.score(200);
                    this.ghost++;
                }

            }
        }

        if (!this.live.LIFE) {
            this.live.LIFE = 3;
            this.live.DEATH = 0;
            this.score.reset();
            this.power.resetCherryQuantite();
            this.tryNext();
        }
        
    }

    win() {
        if (this.gameboard.empty()) {
            if (!this.live.DEATH) this.live.LIFE = this.live.LIFE <= 7 ? ++this.live.LIFE : 7;
            this.score.score(500);
            this.tryNext();
        }
    }

    tryNext() {
        game.round(true);
        game.end(true);
        game.pause();
        game.current(0);
    }

    draw() {
        
        this.screen.drawImage(
            this.image[this.direction],
            this.frameCount * this.image[this.direction].height,
            0,
            this.image[this.direction].width / this.frameLength,
            this.image[this.direction].height,
            this.position.x + this.position.floor((this.width / 2) - ((this.width * this.scale) / 2)),
            this.position.y + this.position.floor((this.height / 2) - ((this.height * this.scale) / 2)),
            this.width * this.scale,
            this.height * this.scale
        );
    }
}