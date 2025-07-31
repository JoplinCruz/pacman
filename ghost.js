
class Ghost{
    constructor(context, imageHealth, imageRetreat, imageInjured, position, direction, width, height, scale, speed, idleRoute, injuredTarget, radarRadius, color) {
        this.screen = context;
        this.imageHealth = imageHealth;
        this.imageRetreat = imageRetreat;
        this.imageInjured = imageInjured;
        this.image = this.imageHealth;
        this.position = position;
        this.nextPosition = { ...this.position };
        this.delta = { x: 0, y: 0 };
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.speed = speed;
        this.color = color;
        this.frameCount = 0;
        this.frameLength = 3;
        this.scale = scale;
        this.delay = 0;
        this.delayLimit = 3;
        this.action = {
            IDLE: 1,
            ATTACK: 2,
            RETREAT: 3,
            RECOVERY: 4,
        };
        this.status = this.action.ATTACK;
        this.evadeTargets = [
            {x: 1 * blocksize, y: 1 * blocksize},
            {x: 26 * blocksize, y: 1 * blocksize},
            {x: 26 * blocksize, y: 29 * blocksize},
            {x: 1 * blocksize, y: 29 * blocksize},
        ];
        this.idleRoute = idleRoute;
        this.idleIndex = 0;
        this.idleLoop = false;
        this.injured = false;
        this.injuredTarget = injuredTarget;
        this.path = [];
        this.target = this.idle[this.idleIndex];
        this.radaRadius = radarRadius;
        this.defaults();
    }

    defaults() { 
        this.default = {
            position: { ...this.position },
            nextPosition: { ...this.nextPosition },
            direction: this.direction,
            speed: this.speed,
            idleLoop: this.idleLoop,
            injured: this.injured,
            target: this.target,
        };
    }
    
    reset() {
        this.position.x = this.default.position.x;
        this.position.y = this.default.position.y;
        this.nextPosition.x = this.default.nextPosition.x;
        this.nextPosition.y = this.default.nextPosition.y;
        this.speed = this.default.speed;
        this.direction = this.default.direction;
        this.status = this.default.status;
        this.injured = this.default.injured;
        this.target = this.default.target;
    }

    runtime() {
        this.delay = this.delay === this.delayLimit ? 0 : this.delay + 1;
        if (this.delay === this.delayLimit)
            this.frameCount = this.frameCount === this.frameLength - 1 ? 0 : this.frameCount + 1;

        if (this.collision(pacmanPosition)) {
            if (pacmanPOWER.ON) {
                this.injured = true;
            }
            
        }
        
        this.main();
        
        this.forward();
        if (this.collision(this.position, WALL))
            this.backward();
    }

    main() {

        this.checkStatus();
        
        switch (this.status) {
            case this.action.IDLE:
                this.idle();
                break;
            case this.action.ATTACK:
                this.attack();
                break;
            case this.action.RETREAT:
                this.retreat();
                break;
            case this.action.RECOVERY:
                this.recovery()
                break;
        }

        
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
                break;
        }
    }

    forward() {
        this.speed = Math.abs(this.speed);
        this.move();
    }

    backward() {
        this.speed = -Math.abs(this.speed);
        this.move();
    }

    changeDirection(target) {
        
        this.speed = this.injured ? ghostInjuredSpeed : ghostSpeed;

        let [row, column] = this.getCoordinates();
        let [nextROW, nextCOLUMN] = this.calcPATH(target);

        this.nextPosition.x = nextCOLUMN * blocksize;
        this.nextPosition.y = nextROW * blocksize;

        let deltaROW = this.floor(nextROW) - this.floor(row);
        let deltaCOLUMN = this.floor(nextCOLUMN) - this.floor(column);

        if (deltaROW > 0) this.direction = DIRECTION_DOWN;
        if (deltaROW < 0) this.direction = DIRECTION_UP;
        if (deltaCOLUMN > 0) this.direction = DIRECTION_RIGHT;
        if (deltaCOLUMN < 0) this.direction = DIRECTION_LEFT;
    }

    collision(target, collider) {
        let [row, column] = this.getCoordinates();
        let targetROW = target.y / blocksize;
        let targetCOLUMN = target.x / blocksize;

        if (collider) {
            if (grid[this.floor(row)][this.floor(column)] === collider ||
                grid[this.ceil(row)][this.ceil(column)] === collider)
                return true;
        } else {
            if (this.floor(row) === this.ceil(targetROW) && this.ceil(column) === this.floor(targetCOLUMN) ||
                this.ceil(row) === this.floor(targetROW) && this.floor(column) === this.ceil(targetCOLUMN))
                return true;
        }

        return false;
    }

    checkStatus() {

        if (pacmanPOWER.ON) {
            this.status = this.action.RETREAT;
            this.image = this.imageRetreat;
        } else if (!pacmanPOWER.ON) {
            if (this.radar(pacmanPosition)) {
                this.status = this.action.ATTACK;
                this.image = this.imageHealth;
            } else {
            this.status = this.action.IDLE;
            this.image = this.imageHealth;
            }
        }

        if (this.injured) {
            this.status = this.action.RECOVERY;
            this.image = this.imageInjured;
            // this.speed = ghostInjuredSpeed;
        };
    }
    
    checkPath() {
        return (this.position.x / blocksize) === parseInt(this.position.x / blocksize) &&
            (this.position.y / blocksize) === parseInt(this.position.y / blocksize);
    }
    
    idle() {

        this.target = this.idleRoute[this.idleIndex];
        if (this.collision(this.target)) {
            if (this.idleLoop) {
                this.idleIndex = this.idleIndex < this.idleRoute.length - 1 ? this.idleIndex + 1 : 0;
            } else {
                this.idleLoop = true;
            }
        }

        if (this.checkPath())
            this.changeDirection(this.target);
    }
    
    attack() {

        switch (this.color) {
            case ghostCOLOR.RED:
                // console.log("red attack!");
                break;
            case ghostCOLOR.CYAN:
                // console.log("cyan attack!");
                break;
            case ghostCOLOR.PINK:
                // console.log("pink attack!");
                break;
            case ghostCOLOR.YELLOW:
                // console.log("yellow attack!");
                break;
        }
        
        if (pacmanPosition.x >= 0 && pacmanPosition.x < windowSize.width) {
            this.target = pacmanPosition;
        } else {
            this.target = { x: 13 * blocksize, y: 11 * blocksize };
        }

        if (this.checkPath())
            this.changeDirection(this.target);
        
    }

    retreat() {

        this.calcDELTA(pacmanPosition);
        if (this.delta.x >= 0) {
            this.target = this.delta.y >= 0 ? this.evadeTargets[0] : this.evadeTargets[3];
        } else {
            this.target = this.delta.y > 0 ? this.evadeTargets[1] : this.evadeTargets[2];
        }

        if (this.checkPath())
            this.changeDirection(this.target);
    }
    
    recovery() {

        if (this.injured) {
            this.target = this.injuredTarget;
            if (this.collision(this.injuredTarget)) {
                this.injured = false;
            }
        }
        
        if (this.checkPath()) {
            this.changeDirection(this.target);
        }
    }

    #neighbors(location) {
        let [row, column] = location;

        let N = [row - 1, column];
        let S = [row + 1, column];
        let E = [row, column + 1];
        let W = [row, column - 1];

        let unfilteredNeighbors = (row + column) % 2 === 0 ? [S, N, W, E] : [E, W, N, S];
        let neighbors = unfilteredNeighbors
            .filter((node) =>
                (node[0] >= 0 && node[0] < grid.length) && (node[1] >= 0 && node[1] < grid[0].length))
            .filter((node) =>
                grid[node[0]][node[1]] !== 1);
        
        return neighbors;
    }

    #convertToID(row, column) {
        return ((row * windowSize.width) + column);
    }

    #convertFromID(id) {
        return [(id / windowSize.width) >> 0, id % windowSize.width];
    }
    
    calcPATH(target) {
        let [sourceROW, sourceCOLUMN] = this.getCoordinates();
        let [targetROW, targetCOLUMN] = this.getCoordinates(target);

        sourceROW = parseInt(sourceROW);
        sourceCOLUMN = parseInt(sourceCOLUMN);
        targetROW = parseInt(targetROW);
        targetCOLUMN = parseInt(targetCOLUMN);

        let sourceID = this.#convertToID(sourceROW, sourceCOLUMN);
        let targetID = this.#convertToID(targetROW, targetCOLUMN);

        let frontier = [];
        frontier.push(sourceID);
        
        let source = {};
        source[sourceID] = null;

        while (frontier.length) {

            let currentID = frontier.shift();
            if (currentID === targetID) break;

            for (let neighbor of this.#neighbors(this.#convertFromID(currentID))) {
                let neighborID = this.#convertToID(neighbor[0], neighbor[1]);
                if (!Object.keys(source).includes(neighborID.toString())) {
                    frontier.push(neighborID);
                    source[neighborID] = currentID;
                }
            }
        }

        let path = [];
        let locationID = targetID;
        while (locationID) {
            path.push(this.#convertFromID(locationID));
            locationID = source[locationID];
        }

        this.path = path.reverse();
        
        return path.length > 1 ? path[1]: path;
    }
    
    calcDISTANCE(target) { 
        this.calcDELTA(target);
        return (this.delta.x**2 + this.delta.y**2)**(1/2)
    }
    
    calcANGLE(target) {
        this.calcDELTA(target);
        return Math.atan2(this.delta.y, this.delta.x);
    }

    calcDELTA(target) {
        this.delta.x = target.x - this.position.x;
        this.delta.y = target.y - this.position.y;
    }
    
    radar(target) {
        if (this.calcDISTANCE(target) <= this.radaRadius) return true;
        return false;
    }

    getCoordinates(target) {
        if (target)
            return [target.y / blocksize, target.x / blocksize];
            
        return [this.position.y / blocksize, this.position.x / blocksize];
    }

    floor(number) {
        return Math.floor(number);
    }

    ceil(number) {
        return Math.ceil(number);
    }

    round(number) {
        return Math.round(number);
    }

    draw() {
        this.screen.save();

        this.screen.drawImage(
            this.image,
            (this.frameCount * this.image.height) + (this.direction * this.frameLength * this.image.height),
            0,
            this.image.height,
            this.image.height,
            this.position.x + parseInt((this.width / 2) - ((this.width * this.scale) / 2)),
            this.position.y + parseInt((this.height / 2) - ((this.height * this.scale) / 2)),
            this.width * this.scale,
            this.height * this.scale
        )

        this.screen.restore();

        /* Radar Radius 
        this.screen.strokeStyle = ghostAttackRadiusColor;
        this.screen.moveTo(
            this.position.x + parseInt(this.width / 2) + this.radaRadius,
            this.position.y + parseInt(this.height / 2),
        );
        this.screen.arc(
            this.position.x + parseInt(this.width / 2),
            this.position.y + parseInt(this.height / 2),
            this.radaRadius,
            0,
            Math.PI * 2
        );
        this.screen.stroke();
        */
    }
}