
class Ghost{

    /**
     * 
     * @param {HTMLCanvasElement} context 
     * @param {HTMLImageElement} imageHealth 
     * @param {HTMLImageElement} imageRetreat 
     * @param {HTMLImageElement} imageInjured 
     * @param {Vector} position 
     * @param {number} direction 
     * @param {number} width 
     * @param {number} height 
     * @param {number} scale 
     * @param {number} speed 
     * @param {Vector[]} idleRoute 
     * @param {object} injured 
     * @param {number} radarRadius 
     * @param {string} color 
     * @param {Gameboard} gameboard 
     */
    constructor(context, imageHealth, imageRetreat, imageInjured, position, direction, width, height, scale, speed, idleRoute, injured, radarRadius, color, gameboard) {
        this.screen = context;
        this.imageHealth = imageHealth;
        this.imageRetreat = imageRetreat;
        this.imageInjured = imageInjured;
        this.image = this.imageHealth;
        this.position = position;
        this.nextPosition = new Vector(this.position.x, this.position.y);
        this.delta = new Vector(0,0); // remove this
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.speed = speed;
        this.color = color;
        this.gameboard = gameboard;
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
            position: { x: this.position.x, y: this.position.y },
            nextPosition: { x: this.position.x, y: this.position.y },
            direction: this.direction,
            speed: this.speed,
            idleLoop: this.idleLoop,
            injured: { ...this.injured },
            target: this.target,
        };
    }
    
    reset() {
        this.position.change(this.default.position.x, this.default.position.y);
        this.nextPosition.change(this.default.nextPosition.x, this.nextPosition.y);
        this.speed = this.default.speed;
        this.direction = this.default.direction;
        this.status = this.default.status;
        this.injured = { ...this.default.injured };
        this.target = this.default.target;
    }

    runtime() {
        this.delay.COUNT = this.delay.COUNT === this.delay.LENGTH ? 0 : ++this.delay.COUNT;
        if (this.delay.COUNT === this.delay.LENGTH)
            this.frameCount = this.frameCount === this.frameLength - 1 ? 0 : this.frameCount + 1;

        if (this.checkCollision(pacmanCONFIG.position)) {
            if (pacmanCONFIG.power.ON) {
                this.injured.HURT = true;
                this.injured.SAFE = false;
            }
            
        }
        
        this.main();
        
        this.forward();
        if (this.checkCollision(this.gameboard.WALL))
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

        if (this.position.checkGrid())
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

        this.target = pacmanCONFIG.position;

        if (this.position.checkGrid())
            this.changeDirection(this.target);
        
    }

    retreat() {
        this.target = pacmanCONFIG.position;

        if (this.position.checkGrid())
            this.changeDirection(this.target);
    }
    
    recovery() {
        this.target = this.injured.HOME;

        if (this.checkCollision(this.injured.HOME))
            this.injured.HURT = false;
        
        if (this.position.checkGrid()) {
            this.changeDirection(this.target);
        }
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

        this.nextPosition = this.position.convertFromGrid(this.#calcNextPATH(target));

        let deltaROW = this.position.grid.floor().delta(this.nextPosition.grid).row;
        let deltaCOLUMN = this.position.grid.floor().delta(this.nextPosition.grid).column;

        if (deltaROW > 0) this.direction = DIRECTION_DOWN;
        if (deltaROW < 0) this.direction = DIRECTION_UP;
        if (deltaCOLUMN > 0) this.direction = DIRECTION_RIGHT;
        if (deltaCOLUMN < 0) this.direction = DIRECTION_LEFT;
    }

    /**
     * 
     * @param {Vector | number} collider 
     * @returns {boolean}
     */
    checkCollision(collider) {

        if (collider instanceof Vector)
            return this.position.collision(collider);
        else
            return this.gameboard.collision(this.position.grid.ceil()) === collider ||
                this.gameboard.collision(this.position.grid.floor()) === collider;
    }

    checkStatus() {
        if (pacmanCONFIG.power.ON) {
            this.status = this.radar(pacmanCONFIG.position) ? this.action.RETREAT : this.action.IDLE;
            this.image = this.imageRetreat;
        } else {
            this.status = this.radar(pacmanCONFIG.position) ? this.action.ATTACK : this.action.IDLE;
            this.image = this.imageHealth;
            if (!this.injured.SAFE) this.injured.SAFE = true;
        }

        if (!this.injured.SAFE || this.injured.HURT) {
            this.image = this.injured.HURT ? this.imageInjured : this.imageHealth;
            this.status = this.action.RECOVERY;
        }
    }

    #calcCOST(target) {
        
        let angle = this.position.angle(pacmanCONFIG.position);
        let weight = [
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
            [6, 9], [6, 8], [6, 7],]
            .map(point => (new Grid(point[0], point[1]).rotation(angle)).add(this.position.grid))
            .filter(point => this.gameboard.checkBounds(point))
            .map(point => point.id);
        
        return weight;
    }

    /**
     * 
     * @param {Vector} target 
     * @returns {Grid}
     */
    #calcNextPATH(target) {
        let retreat = this.status === this.action.RETREAT;
        
        let targetID = target.grid.id;

        let countdown = 8;
        let bestESCAPE = {
            DISTANCE: -Infinity,
            TARGET: null,
        };
        
        let frontier = [];
        frontier.push(this.position.grid.floor());
        
        let source = {};
        source[this.position.grid.id] = null;

        while (countdown) {
            
            let current = frontier.shift();
            
            if (!current || (current.id === targetID && !retreat)) break;

            for (let neighbor of this.gameboard.neighbors(current.floor())) {
                if (!Object.keys(source).includes(neighbor.id.toString())) {
                    if (retreat && !this.#calcCOST(pacmanCONFIG.position).includes(neighbor.id)) {
                        frontier.push(neighbor);
                        source[neighbor.id] = current;

                        let pacmanDISTANCE = this.position.distance(
                            this.position.convertFromGrid(neighbor),
                            target
                        );

                        if (pacmanDISTANCE > bestESCAPE.DISTANCE) {
                            bestESCAPE.DISTANCE = pacmanDISTANCE;
                            bestESCAPE.TARGET = neighbor.id;
                        }
                    }
                    if (this.status !== this.action.RETREAT) {
                        frontier.push(neighbor);
                        source[neighbor.id] = current;
                    }
                }
            }

            countdown = retreat ? --countdown : frontier.length;
        }

        
        if (retreat) {
            targetID = bestESCAPE.TARGET;
        }
        
        let path = retreat ? [] : [target.grid];
        let locationID = targetID;
        
        while (source[locationID]) {
            path.push(source[locationID]);
            locationID = source[locationID] ? source[locationID].id : source[locationID];
        }

        this.path = path.reverse();
        
        return path.length > 1 ? path[1] : path[0];
    }
    
    radar(target) {
        if (this.position.distance(target) <= this.radaRadius) return true;
        return false;
    }

    draw() {
        this.screen.save();

        this.screen.drawImage(
            this.image,
            (this.frameCount * this.image.height) + (this.direction * this.frameLength * this.image.height),
            0,
            this.image.height,
            this.image.height,
            this.position.x + this.position.floor((this.width / 2) - ((this.width * this.scale) / 2)),
            this.position.y + this.position.floor((this.height / 2) - ((this.height * this.scale) / 2)),
            this.width * this.scale,
            this.height * this.scale
        )

        this.screen.restore();

        if (this.refs) this.drawRADAR();

    }

    drawRADAR() {

        this.screen.strokeStyle = ghostAttackRadiusColor;
        this.screen.moveTo(
            this.position.x + this.position.floor(this.width / 2) + this.radaRadius,
            this.position.y + this.position.floor(this.height / 2),
        );
        this.screen.arc(
            this.position.x + this.position.floor(this.width / 2),
            this.position.y + this.position.floor(this.height / 2),
            this.radaRadius,
            0,
            Math.PI * 2
        );
        this.screen.stroke();
    }

    /**
     * 
     * @param {Grid[]} grids 
     */
    drawDOT(grids) {
        for (let point in grids) {
            let position = this.position.convertFromGrid(point);
            this.screen.strokeStyle = ghostAttackRadiusColor;
            this.screen.moveTo(
                position.x + position.floor(3 * this.width / 4),
                position.y + position.floor(this.height / 2)
            );
            this.screen.arc(
                position.x + position.floor(this.width / 2),
                position.y + position.floor(this.height / 2),
                this.width / 4,
                0,
                Math.PI * 2
            );
            this.screen.stroke();
        }
    }
}