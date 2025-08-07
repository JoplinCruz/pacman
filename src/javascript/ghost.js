
class Ghost{
    constructor(context, imageHealth, imageRetreat, imageInjured, position, direction, width, height, scale, speed, idleRoute, injured, radarRadius, color) {
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
        this.delay = {
            COUNT: 0,
            LENGTH: 3,
        };
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
            {x: 1 * blocksize, y: 29 * blocksize},
            {x: 26 * blocksize, y: 29 * blocksize},
        ];
        this.idleRoute = idleRoute;
        this.idleIndex = 0;
        this.idleLoop = false;
        this.injured = injured;
        this.path = [];
        this.target = this.idle[this.idleIndex];
        this.radaRadius = radarRadius;
        this.refs = false;
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
        this.delay.COUNT = this.delay.COUNT === this.delay.LENGTH ? 0 : ++this.delay.COUNT;
        if (this.delay.COUNT === this.delay.LENGTH)
            this.frameCount = this.frameCount === this.frameLength - 1 ? 0 : this.frameCount + 1;

        if (this.checkCollision(pacmanPosition)) {
            if (pacmanPOWER.ON) {
                this.injured.HURT = true;
                this.injured.SAFE = false;
            }
            
        }
        
        this.main();
        
        this.forward();
        if (this.checkCollision(this.position, WALL))
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
    
    idle() {
        this.target = this.idleRoute[this.idleIndex];

        if (this.checkCollision(this.target)) {
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

        this.target = pacmanPosition;

        if (this.checkPath())
            this.changeDirection(this.target);
        
    }

    retreat() {
        // this.target = this.calcRETREAT(pacmanPosition);
        this.target = pacmanPosition;

        if (this.checkPath())
            this.changeDirection(this.target);
    }
    
    recovery() {
        this.target = this.injured.HOME;

        if (this.checkCollision(this.injured.HOME))
            this.injured.HURT = false;
        
        if (this.checkPath()) {
            this.changeDirection(this.target);
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
        
        this.speed = this.injured.HURT ? this.injured.SPEED : ghostSpeed;

        let [row, column] = this.getCoordinates();
        let [nextROW, nextCOLUMN] = this.#calcNextPATH(target);

        this.nextPosition.x = nextCOLUMN * blocksize;
        this.nextPosition.y = nextROW * blocksize;

        let deltaROW = this.floor(nextROW) - this.floor(row);
        let deltaCOLUMN = this.floor(nextCOLUMN) - this.floor(column);

        if (deltaROW > 0) this.direction = DIRECTION_DOWN;
        if (deltaROW < 0) this.direction = DIRECTION_UP;
        if (deltaCOLUMN > 0) this.direction = DIRECTION_RIGHT;
        if (deltaCOLUMN < 0) this.direction = DIRECTION_LEFT;
    }

    checkCollision(target, collider) {
        let [row, column] = this.getCoordinates();
        let targetROW = target.y / blocksize;
        let targetCOLUMN = target.x / blocksize;

        if (collider) {
            if (gameboard.grid[this.floor(row)][this.floor(column)] === collider ||
                gameboard.grid[this.ceil(row)][this.ceil(column)] === collider)
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
            this.status = this.radar(pacmanPosition) ? this.action.RETREAT : this.action.IDLE;
            this.image = this.imageRetreat;
        } else {
            this.status = this.radar(pacmanPosition) ? this.action.ATTACK : this.action.IDLE;
            this.image = this.imageHealth;
            if (!this.injured.SAFE) this.injured.SAFE = true;
        }

        if (!this.injured.SAFE || this.injured.HURT) {
            this.image = this.injured.HURT ? this.imageInjured : this.imageHealth;
            this.status = this.action.RECOVERY;
        }
    }
    
    checkPath() {
        return (this.position.x / blocksize) === parseInt(this.position.x / blocksize) &&
            (this.position.y / blocksize) === parseInt(this.position.y / blocksize);
    }

    checkBounds(coordinates) {
        return coordinates[0] >= 0 && coordinates[0] < gameboard.height ** coordinates[1] >= 0 && coordinates[1] < gameboard.width;
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
                (node[0] >= 0 && node[0] < gameboard.height) && (node[1] >= 0 && node[1] < gameboard.width))
            .filter((node) =>
                gameboard.grid[node[0]][node[1]] !== 1);
        
        return neighbors;
    }

    #convertToID(coordinate) {
        return (coordinate[0] * gameboard.width) + coordinate[1];
    }

    #convertFromID(id) {
        return [(id / gameboard.width) >> 0, id % gameboard.width];
    }

    #calcCOST(target) {
        
        let coordinate = this.getCoordinates();
        let points = [
            [-6, 9], [-6, 8], [-6, 7],
            [-5, 8], [-5, 7], [-5, 6],
            [-4, 6], [-4, 5],
            [-3, 5], [-3, 4],
            [-2, 4], [-2, 3],
            [-1, 3], [-1, 2],
            [0, 2], [0, 1],
            [1, 3], [1, 2],
            [2, 4], [2, 3],
            [3, 5], [3, 4],
            [4, 6], [4, 5],
            [5, 8], [5, 7], [5, 6],
            [6, 9], [6, 8], [6, 7],
        ];

        let weight = [];

        for (let POINT of points) {
            let calculatedPoint = [
                this.round(coordinate[0] + this.calcROTATION(POINT)[0]),
                this.round(coordinate[1] + this.calcROTATION(POINT)[1])
            ];
            if (this.checkBounds(calculatedPoint))
                weight.push(this.#convertToID(calculatedPoint));
        }

        return weight;
    }

    #calcNextPATH(target) {
        let retreat = this.status === this.action.RETREAT ? true : false;
        
        let [sourceROW, sourceCOLUMN] = this.getCoordinates();
        let [targetROW, targetCOLUMN] = this.getCoordinates(target);

        let sourceID = this.#convertToID([this.floor(sourceROW), this.floor(sourceCOLUMN)]);
        let targetID = this.#convertToID([this.floor(targetROW), this.floor(targetCOLUMN)]);

        let countdown = 8;
        let bestESCAPE = {
            DISTANCE: -Infinity,
            TARGET: null,
        };
        
        let frontier = [];
        frontier.push(sourceID);
        
        let source = {};
        source[sourceID] = null;

        while (countdown) {

            let currentID = frontier.shift();
            if (currentID === targetID && !retreat) break;

            for (let neighbor of this.#neighbors(this.#convertFromID(currentID))) {
                let neighborID = this.#convertToID(neighbor);
                if (!Object.keys(source).includes(neighborID.toString())) {
                    if (retreat && !this.#calcCOST(pacmanPosition).includes(neighborID)) {
                        frontier.push(neighborID);
                        source[neighborID] = currentID;

                        let pacmanDISTANCE = this.calcDISTANCE(
                            this.getPosition(neighbor),
                            this.getPosition([targetROW, targetCOLUMN])
                        );

                        if (pacmanDISTANCE > bestESCAPE.DISTANCE) {
                            bestESCAPE.DISTANCE = pacmanDISTANCE;
                            bestESCAPE.TARGET = neighborID;
                        }
                    }
                    if (this.status !== this.action.RETREAT) {
                        frontier.push(neighborID);
                        source[neighborID] = currentID;
                    }
                }
            }

            countdown = retreat ? --countdown : frontier.length;
        }

        // this.outter = frontier;
        // this.inner = source;

        if (retreat)
            targetID = bestESCAPE.TARGET;

        let path = [];
        let locationID = targetID;
        while (locationID) {
            path.push(this.#convertFromID(locationID));
            locationID = source[locationID];
        }

        this.path = path.reverse();
        
        return path.length > 1 ? path[1] : path[0];
    }
    
    calcDISTANCE(target) {

        if (arguments.length > 1) {
            let source = arguments[0];
            target = arguments[1];
            this.calcDELTA(source, target);
        } else {
            this.calcDELTA(target);
        }

        return (this.delta.x**2 + this.delta.y**2)**(1/2)
    }
    
    calcANGLE(target) {
        
        if (arguments.length > 1) {
            let source = arguments[0];
            target = arguments[1];
            this.calcDELTA(source, target);
        } else {
            this.calcDELTA(target);
        }
        
        return Math.atan2(this.delta.y, this.delta.x);
    }

    calcDELTA(target) {

        if (arguments.length > 1) {
            let source = arguments[0];
            target = arguments[1];
            this.delta.x = target.x - source.x;
            this.delta.y = target.y - source.y;
        } else {
            this.delta.x = target.x - this.position.x;
            this.delta.y = target.y - this.position.y;
        }
    }
    
    calcROTATION(coordinate) {
        let angle = this.calcANGLE(pacmanPosition);
        return [
            coordinate[1] * Math.sin(angle) + coordinate[0] * Math.cos(angle),
            coordinate[1] * Math.cos(angle) - coordinate[0] * Math.sin(angle),
        ];
    }

    getPosition(coordinate) {
        return { x: coordinate[1] * blocksize, y: coordinate[0] * blocksize };
    }

    getCoordinates(target) {
        if (target)
            return [target.y / blocksize, target.x / blocksize];
            
        return [this.position.y / blocksize, this.position.x / blocksize];
    }
    
    radar(target) {
        if (this.calcDISTANCE(target) <= this.radaRadius) return true;
        return false;
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

        if (this.refs) this.drawRADAR();

    }

    drawRADAR() {

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
    }
}