
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
            {x: 1 * blocksize, y: 29 * blocksize},
            {x: 26 * blocksize, y: 29 * blocksize},
        ];
        this.idleRoute = idleRoute;
        this.idleIndex = 0;
        this.idleLoop = false;
        this.injured = injured;
        // this.injured = {
        //     HURT: false,
        //     SAFE: true,
        //     HOME: injuredTarget,
        // }
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
        this.delay = this.delay === this.delayLimit ? 0 : this.delay + 1;
        if (this.delay === this.delayLimit)
            this.frameCount = this.frameCount === this.frameLength - 1 ? 0 : this.frameCount + 1;

        if (this.collision(pacmanPosition)) {
            if (pacmanPOWER.ON) {
                this.injured.HURT = true;
                this.injured.SAFE = false;
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
        
        this.speed = this.injured.HURT ? this.injured.SPEED : ghostSpeed;

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
            if (this.radar(pacmanPosition)) {
                this.status = this.action.RETREAT;
            } else {
                this.status = this.action.IDLE;
            }
            this.image = this.imageRetreat;
        } else if (!pacmanPOWER.ON) {
            if (this.radar(pacmanPosition)) {
                this.status = this.action.ATTACK;
                this.image = this.imageHealth;
            } else {
                this.status = this.action.IDLE;
                this.image = this.imageHealth;
            }
            if (!this.injured.SAFE) this.injured.SAFE = true;
        }

        if (!this.injured.SAFE || this.injured.HURT) {
            if (this.injured.HURT) {
                this.image = this.imageInjured;
            } else {
                this.image = this.imageHealth;
            }
            this.status = this.action.RECOVERY;
        }
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
        
        this.target = this.calcRETREAT(pacmanPosition);

        if (this.checkPath())
            this.changeDirection(this.target);
    }
    
    recovery() {

        this.target = this.injured.HOME;

        if (this.collision(this.injured.HOME))
            this.injured.HURT = false;
        
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
                (node[0] >= 0 && node[0] < gameboard.height) && (node[1] >= 0 && node[1] < gameboard.width))
            .filter((node) =>
                gameboard.grid[node[0]][node[1]] !== 1);
        
        return neighbors;
    }

    #convertToID(row, column) {
        return ((row * gameboard.width) + column);
    }

    #convertFromID(id) {
        return [(id / gameboard.width) >> 0, id % gameboard.width];
    }

    #checkInBounds(coordinates) {
        return coordinates[0] >= 0 && coordinates[0] < gameboard.height ** coordinates[1] >= 0 && coordinates[1] < gameboard.width;
    }

    #calcCOST(target) {
        let [sourceROW, sourceCOLUMN] = this.getCoordinates();
        // let [targetROW, targetCOLUMN] = this.getCoordinates(target);
        // let [deltaROW, deltaCOLUMN] = this.getCoordinates(this.calcDELTA(target));
        let targetAngle = this.calcANGLE(target);
        
        let minRadius = {
            POINT: [sourceROW + (2 * Math.sin(targetAngle)), sourceCOLUMN + (2 * Math.cos(targetAngle))],
        };
        let maxRadius = {
            POINT: [sourceROW + (7 * Math.sin(targetAngle)), sourceCOLUMN + (10 * Math.cos(targetAngle))],
            LEFT: [],
            RIGHT: [],
        };
        maxRadius.LEFT = [maxRadius.POINT[0] + (4 * Math.sin(targetAngle - (Math.PI / 2))), maxRadius.POINT[1] + (4 * Math.cos(targetAngle - Math.PI / 2))];
        maxRadius.RIGHT = [maxRadius.POINT[0] + (4 * Math.sin(targetAngle + (Math.PI / 2))), maxRadius.POINT[1] + (4 * Math.cos(targetAngle + Math.PI / 2))];

        let leftANGLE = this.calcANGLE(this.getPosition(minRadius.POINT), this.getPosition(maxRadius.LEFT));
        let rightANGLE = this.calcANGLE(this.getPosition(minRadius.POINT), this.getPosition(maxRadius.RIGHT));

        this.calcDELTA(
            { x: minRadius.POINT[1], y: minRadius.POINT[0] },
            { x: maxRadius.LEFT[1], y: maxRadius.LEFT[0] },
        );
        let leftDELTA = { x: this.delta.x, y: this.delta.y };

        this.calcDELTA(
            { x: minRadius.POINT[1], y: minRadius.POINT[0] },
            { x: maxRadius.RIGHT[1], y: maxRadius.RIGHT[0] },
        );
        let rightDELTA = { x: this.delta.x, y: this.delta.y };

        let pacmanWEIGHT = [];
        if (leftDELTA.x >= leftDELTA.y) {
            for (let x = 0; x <= this.round(leftDELTA.x); x++) {
                let row = this.floor(minRadius.POINT[0] + (x * Math.tan(leftANGLE))),
                    column = this.floor(minRadius.POINT[1] + x);
                if (this.#checkInBounds([row, column]))
                    pacmanWEIGHT.push(this.#convertToID(row, column));
            }
        } else {
            for (let y = 0; y <= this.round(leftDELTA.y); y++) {
                let row = this.floor(minRadius.POINT[0] + y),
                    column = this.floor(minRadius.POINT[1] + (y / Math.tan(leftANGLE)));
                if (this.#checkInBounds([row, column]))
                    pacmanWEIGHT.push(this.#convertToID(row, column));
            }
        }

        if (rightDELTA.x >= rightDELTA.y) {
            for (let x = 0; x <= this.round(rightDELTA.x); x++) {
                let row = this.floor(minRadius.POINT[0] + (x * Math.tan(rightANGLE))),
                    column = this.floor(minRadius.POINT[1] + x);
                if (this.#checkInBounds([row, column]))
                    pacmanWEIGHT.push(this.#convertToID(row, column));
            }
        } else {
            for (let y = 0; y <= this.round(rightDELTA.y); y++) {
                let row = this.floor(minRadius.POINT[0] + y),
                    column = this.floor(minRadius.POINT[1] + (y / Math.tan(rightANGLE)));
                if (this.#checkInBounds([row, column]))
                    pacmanWEIGHT.push(this.#convertToID(row, column));
            }
        }

        if (this.refs)
            for (let weight of pacmanWEIGHT) this.drawLINES([maxRadius.LEFT, minRadius.POINT, maxRadius.RIGHT]);
        
        return pacmanWEIGHT;
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

        return path.length > 1 ? path[1] : path[0];
    }

    calcRETREAT(target) {
        let [sourceROW, sourceCOLUMN] = this.getCoordinates();
        let [targetROW, targetCOLUMN] = this.getCoordinates(target);

        sourceROW = parseInt(sourceROW);
        sourceCOLUMN = parseInt(sourceCOLUMN);
        targetROW = parseInt(targetROW);
        targetCOLUMN = parseInt(targetCOLUMN);

        let sourceID = this.#convertToID(sourceROW, sourceCOLUMN);
        let targetID = this.#convertToID(targetROW, targetCOLUMN);

        let countdown = 15;
        
        let frontier = [];
        frontier.push(sourceID);
        
        let source = {};
        source[sourceID] = null;

        while (countdown) {

            let currentID = frontier.shift();
            // if (currentID === targetID && !retreat) break;

            for (let neighbor of this.#neighbors(this.#convertFromID(currentID))) {
                let neighborID = this.#convertToID(neighbor[0], neighbor[1]);
                if (!Object.keys(source).includes(neighborID.toString()) && !this.#calcCOST(pacmanPosition).includes(neighborID)) {
                    frontier.push(neighborID);
                    source[neighborID] = currentID;
                }
            }

            countdown--;
        }

        // this.outter = frontier;
        // this.inner = source;

        let greaterDistance = -Infinity;
        let retreatTarget = null;

        for (let front of frontier) {

            let frontCoordinate = this.#convertFromID(front);
            let distanceFromPacman = ((frontCoordinate[0] - targetROW) ** 2 + (frontCoordinate[1] - targetCOLUMN) ** 2) ** .5;

            if (distanceFromPacman > greaterDistance) {
                retreatTarget = frontCoordinate;
                greaterDistance = distanceFromPacman;
            }

            if (this.refs) this.drawDOTS(frontCoordinate);
        }

        return { x: retreatTarget[1] * blocksize, y: retreatTarget[0] * blocksize };

        // let path = [];
        // let locationID = targetID;
        // while (locationID) {
        //     path.push(this.#convertFromID(locationID));
        //     locationID = source[locationID];
        // }

        // this.path = path.reverse();
        
        // return path.length > 1 ? path[1] : path[0];
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
    
    radar(target) {
        if (this.calcDISTANCE(target) <= this.radaRadius) return true;
        return false;
    }

    getPosition(coordinate) {
        return { x: coordinate[1] * blocksize, y: coordinate[0] * blocksize };
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

    drawLINES(path) {

        this.screen.strokeStyle = "green";
        this.screen.lineWidth = 2;
        
        for (let i = 0; i < path.length; i++) {
            let point = {
                x: path[i][1] * blocksize,
                y: path[i][0] * blocksize,
            }

            if (i === 0) {
                this.screen.moveTo(point.x, point.y);
            } else {
                this.screen.lineTo(point.x, point.y);
            }
        }

        this.screen.stroke();
    }
    
    drawDOTS(coordinates) {
        // --------------------------------| start visualization --->
        let position = {
            x: coordinates[1] * blocksize,
            y: coordinates[0] * blocksize,
        };
        this.screen.lineWidth = 1;
        this.screen.strokeStyle = "blue";
        this.screen.moveTo(
            position.x + this.floor((3 * blocksize) / 4),
            position.y + this.floor(blocksize / 2)
        );
        this.screen.arc(
            position.x + this.floor(blocksize / 2),
            position.y + this.floor(blocksize / 2),
            blocksize / 4,
            0,
            Math.PI * 2
        );
        this.screen.stroke();
        // ---------------------------------| end visualization --->
    }
}