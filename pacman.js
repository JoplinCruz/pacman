
class Pacman {
    constructor(context, image, position, width, height, direction, speed) {
        this.screen = context;
        this.image = image;
        this.position = position;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.speed = speed;
        this.frameCount = 3;
        this.frameLength = 7;
        this.nextDirection = direction;
        this.score = 0;
        this.food = 0;
        this.bigfood = 0;
        this.cherry = 0;
        this.scale = 1.5;
        this.life = 3;
        // this.lifeInterval = null;
        this.defaults();
    }

    defaults() {
        this.default = {
            position: { ...this.position },
            direction: this.direction,
            nextDirection: this.nextDirection,
            frameCount: this.frameCount,
            score: this.score,
            food: this.food,
            bigfood: this.bigfood,
            cherry: this.cherry,
            life: this.life,
            // lifeInterval: this.lifeInterval,
        }
    }

    reset() {
        this.position.x = this.default.position.x;
        this.position.y = this.default.position.y;
        this.direction = this.default.direction;
        this.nextDirection = this.default.nextDirection;
        this.frameCount = this.default.frameCount;

        // if (this.lifeInterval > 5) {
        //     console.log(this.lifeInterval);
        //     this.life--;
        //     console.log(this.life);
        //     this.lifeInterval = 0;
        // }
    }

    runtime() {
        this.frameCount = this.frameCount === this.frameLength - 1 ? 0 : this.frameCount + 1;
        // this.lifeInterval++;

        this.turnDirection();
        this.forward();
        if (this.collision()) this.backward();
        this.ghostCollision();
        this.eat();
        this.checkDump();
    }

    collision(row, column, collider) {
        if (row === undefined || column === undefined)
            [row, column] = this.getCoordinates();

        if (!collider) collider = WALL

        if (gameboard.grid[this.ceil(row)][this.ceil(column)] === collider ||
            gameboard.grid[this.floor(row)][this.floor(column)] === collider)
            return true;

        return false;
    }

    move() {
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.position.x += this.speed;
                break;
            case DIRECTION_DOWN:
                this.position.y += this.speed;
                break;
            case DIRECTION_LEFT:
                this.position.x -= this.speed;
                break;
            case DIRECTION_UP:
                this.position.y -= this.speed;
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
        let [row, column] = this.getCoordinates();
        
        if (this.floor(column) === column &&
            this.floor(row) === row || 
            this.direction % 2 === this.nextDirection % 2) {
            this.direction = this.isPossibleTurn() ? this.nextDirection : this.direction;
        }
    }

    isPossibleTurn() {
        let [row, column] = this.getCoordinates();
        row = this.floor(row);
        column = this.floor(column);

        switch (this.nextDirection) {
            case DIRECTION_UP:
                return !(this.collision(row - 1, column));
            case DIRECTION_DOWN:
                return !(this.collision(row + 1, column));
            case DIRECTION_LEFT:
                return !(this.collision(row, column - 1));
            case DIRECTION_RIGHT:
                return !(this.collision(row, column + 1));
        }
    }

    ceil(number) {
        return Math.ceil(number);
    }

    floor(number) {
        return Math.floor(number);
    }

    round(number) {
        return Math.round(number);
    }

    getCoordinates(target) {
        if (target)
            return [target.y / blocksize, target.x / blocksize];

        return [this.position.y / blocksize, this.position.x / blocksize];
    }

    eat() {

        let [row, column] = this.getCoordinates();
        row = this.round(row), column = this.round(column);
        
        if (this.collision(row, column, FOOD)) {
            gameboard.grid[row][column] = 0;
            this.score += 1;
            this.food += 1;
        }

        if (this.collision(row, column, BIGFOOD)) {
            gameboard.grid[row][column] = 0;
            this.score += 10;
            this.bigfood += 1;
            pacmanPOWER.ON = true;
            pacmanPOWER.TIMER = 8 * fps;
        }

    }

    ghostCollision() {

        for (let ghost of ghostsCONFIG) {            
            let [pacmanROW, pacmanCOLUMN] = this.getCoordinates();
            let [ghostROW, ghostCOLUMN] = this.getCoordinates(ghost.position);
            
            if (!pacmanPOWER.ON && !ghost.injured.HURT) {
                if (this.floor(pacmanROW) === this.ceil(ghostROW) &&
                    this.floor(pacmanCOLUMN) === this.ceil(ghostCOLUMN) ||
                    this.ceil(pacmanROW) === this.floor(ghostROW) &&
                    this.ceil(pacmanCOLUMN) === this.floor(ghostCOLUMN)) {
                    this.life = this.life <= 0 ? 0 : this.life - 1;
                    game.RESET = true;
                    game.TIMER = 0;
                }
            }
            if (this.life <= 0) {
                game.RESTART = true;
                game.PLAY = false
                game.TIMER = 0;
            }
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
            this.position.x + parseInt((this.width / 2) - ((this.width * this.scale) / 2)),
            this.position.y + parseInt((this.height / 2) - ((this.height * this.scale) / 2)),
            this.width * this.scale,
            this.height * this.scale
        );
        
        this.screen.restore();
    }
}