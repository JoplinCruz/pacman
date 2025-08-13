
class Pacman {

    /**
     * 
     * @param {HTMLCanvasElement} context 
     * @param {HTMLImageElement} image 
     * @param {Vector} position 
     * @param {number} width 
     * @param {number} height 
     * @param {number} direction 
     * @param {number} speed 
     * @param {Gameboard} gameboard 
     * @param {{SCORE: number, HIGH: number}} score
     * @param {{LIFE: number, DEATH: number}} live
     */
    constructor(context, image, position, width, height, direction, speed, gameboard, score, live) {
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
        this.food = 0;
        this.bigfood = 0;
        this.cherry = 0;
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
            score: { SCORE: this.score.SCORE, BEST: this.score.HIGH },
            food: this.food,
            bigfood: this.bigfood,
            cherry: this.cherry,
        }
    }

    reset() {
        this.position.change(this.default.position.x, this.default.position.y);
        this.direction = this.default.direction;
        this.nextDirection = this.default.nextDirection;
        this.frameCount = this.default.frameCount;
        pacmanCONFIG.power.ON = false;
        pacmanCONFIG.power.TIMER = 0;
    }

    runtime() {
        this.frameCount = this.frameCount === this.frameLength - 1 ? 0 : this.frameCount + 1;
        this.live.LIFE = this.live.LIFE >= 7 ? 7 : this.live.LIFE;

        this.turnDirection();
        this.forward();
        if (this.collision())
            this.backward();
        this.ghostCollision();
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

        let possibleDirection = new Grid(this.position.grid.row, this.position.grid.column);

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
                this.gameboard.fill(this.position.grid.round(), this.gameboard.SPACE);
                this.score.SCORE += 1;
                this.food++;
                break;
            case this.gameboard.BIGFOOD:
                this.gameboard.fill(this.position.grid.round(), this.gameboard.SPACE)
                this.score.SCORE += 10;
                this.bigfood++;
                pacmanCONFIG.power.ON = true;
                pacmanCONFIG.power.TIMER = 8 * fps;
                break;
            case this.gameboard.CHERRY:
                let cherryPOWER = this.gameboard.cherryPOWER.LIFE;
                this.getCherryPOWER(cherryPOWER);
        }

    }

    getCherryPOWER(power) {
        switch (power) {
            case this.gameboard.cherryPOWER.LIFE:
                this.score.SCORE += 100;
                this.cherry++;
                this.live.LIFE++;
                this.live.DEATH = 0;
                break;
            case this.gameboard.cherryPOWER.INVISIBLE:
                break;
            case this.gameboard.cherryPOWER.SPEED:
                break;
        }
    }

    ghostCollision() {

        for (let ghost of ghostsCONFIG) {

            if (this.position.collision(ghost.position) && !ghost.injured.HURT) {

                if (!pacmanCONFIG.power.ON) {
                    this.live.LIFE = this.live.LIFE <= 0 ? 0 : --this.live.LIFE;
                    this.live.DEATH++;
                    game.RESET = true;
                    game.PLAY = false;
                    game.TIMER = 0;
                } else {
                    this.score.SCORE += 200;
                    this.ghost++;
                }

            }
        }

        if (!this.live.LIFE) {
            this.live.LIFE = 3;
            this.live.DEATH = 0;
            this.score.SCORE = 0;
            game.RESET = true;
            game.RESTART = true;
            game.PLAY = false
            game.TIMER = 0;
        }
        
    }

    win() {
        if (this.gameboard.empty()) {
            if (!this.live.DEATH) this.live.LIFE = this.live.LIFE <= 7 ? ++this.live.LIFE : 7;
            this.score.SCORE += 500;
            game.RESET = true;
            game.RESTART = true;
            game.PLAY = false;
            game.TIMER = 0;
        }
    }

    draw() {
        
        this.screen.save();

        this.screen.translate(
            this.position.x + (this.width / 2),
            this.position.y + (this.height / 2)
        );
        this.screen.rotate((this.direction * 90) * (Math.PI / 180));
        this.screen.translate(
            -this.position.x - (this.width / 2),
            -this.position.y - (this.height / 2)
        );
        
        this.screen.drawImage(
            this.image,
            this.frameCount * this.image.height,
            0,
            this.image.width / this.frameLength,
            this.image.height,
            this.position.x + this.position.floor((this.width / 2) - ((this.width * this.scale) / 2)),
            this.position.y + this.position.floor((this.height / 2) - ((this.height * this.scale) / 2)),
            this.width * this.scale,
            this.height * this.scale
        );
        
        this.screen.restore();
    }
}