

class Vector {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {number} blocksize 
     */
    constructor(x, y, width, height, blocksize) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.blocksize = blocksize;
        this.toCoordinate();
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    change(x, y) {
        this.x = x;
        this.y = y;

        this.toCoordinate();
    }

    /**
     * 
     * @param {number} step 
     */
    up(step) {
        this.y -= step;
        this.toCoordinate();
    }

    /**
     * 
     * @param {number} step 
     */
    down(step) {
        this.y += step;
        this.toCoordinate()
    }
    
    /**
     * 
     * @param {number} step 
     */
    left(step) {
        this.x -= step;
        this.toCoordinate();
    }
    
    /**
     * 
     * @param {number} step 
     */
    right(step) {
        this.x += step;
        this.toCoordinate();
    }

    /**
     * 
     * @returns {boolean}
     */
    checkGrid() {
        return this.x % this.blocksize === 0 && this.y % this.blocksize === 0;
    }

    /**
     * 
     * @param {Vector} target 
     */
    checkCollision(target) {
        return this.floor(target.coordinate.row) === this.ceil(this.coordinate.row) &&
            this.ceil(target.coordinate.column) === this.floor(this.coordinate.column) ||
            this.ceil(target.coordinate.row) === this.floor(this.coordinate.row) &&
            this.floor(target.coordinate.column) === this.ceil(this.coordinate.column);
    }

    /**
     * 
     * @param {Vector | number} other 
     * @returns {Vector}
     */
    add(other) {
        return other instanceof Vector ?
            new Vector(this.x + other.x, this.y + other.y) :
            new Vector(this.x + other, this.y * other);
    }

    /**
     * 
     * @param {Vector | number} other 
     * @returns {Vector}
     */
    multiply(other) {
        return other instanceof Vector ?
            new Vector(this.x * other.x, this.y * other.y) :
            new Vector(this.x * other, this.y * other);
    }

    /**
     * 
     * @param {Vector} target 
     * @returns {Vector}
     */
    delta(target) {
        return arguments.length > 1 ?
            new Vector(arguments[1].x - arguments[0].x, arguments[1].y - arguments[0].y) :
            new Vector(target.x - this.x, target.y - this.y);
    }

    /**
     * 
     * @param {Vector} target 
     * @returns {number}
     */
    distance(target) {
        let delta = arguments.length > 1 ? this.delta(target[0], target[1]) : this.delta(target);
        return (delta.x ** 2 + delta.y ** 2) ** .5;
    }

    /**
     * 
     * @param {Vector} target 
     * @returns {number}
     */
    angle(target) {
        let delta = arguments.length > 1 ? this.delta(arguments[0], arguments[1]) : this.delta(target);
        return Math.atan2(delta.y, delta.x);
    }

    /**
     * 
     * @param {Vector} target 
     * @returns {Vector}
     */
    normal(target) {
        let delta = arguments.length > 1 ? this.delta(arguments[0], arguments[1]) : this.delta(target),
            a = delta.x,
            b = delta.y,
            c = arguments.length > 1 ? this.distance(arguments[0], arguments[1]) : this.distance(target);
        return new Vector(a / c, b / c);
    }

    /**
     * 
     * @returns {number[]}
     */
    getCoordinate() {
        return [this.floor(this.coordinate.row), this.floor(this.coordinate.column)];
    }

    toCoordinate() {
        this.coordinate = {
            row: this.y / this.blocksize,
            column: this.x / this.blocksize,
        };
    }

    /**
     * 
     * @param {number[]} coordinate 
     */
    toPosition(coordinate) {
        this.x = coordinate[1] * this.blocksize;
        this.y = coordinate[0] * this.blocksize;
        this.toCoordinate();
    }

    /**
     * 
     * @param {number} angle 
     */
    rotation(angle) {
        return new Vector(
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.x * Math.sin(angle) + this.y * Math.cos(angle)
        ).round();
    }

    /**
     * 
     * @returns {number[number[]]}
     */
    neighbors(coordinate) {
        let row = this.floor(this.coordinate.row), column = this.floor(this.coordinate.column);
        if (coordinate) [row, column] = coordinate;

        let N = [row - 1, column],
            S = [row + 1, column],
            W = [row, column - 1],
            E = [row, column + 1];
        
        let unfilteredNeighbors = (row + column) % 2 === 0 ? [N, S, W, E] : [E, W, S, N];
        let neighbors = unfilteredNeighbors.filter((node) =>
            node[0] >= 0 && node[0] < this.height / this.blocksize && node[1] >= 0 && node[1] < this.width / this.blocksize
        );

        return neighbors;
    }

    /**
     * 
     * @param {number} number 
     * @returns {Vector}
     */
    floor(number) {
        return Math.floor(number)
    }

    /**
     * 
     * @param {number} number 
     * @returns {Vector}
     */
    ceil(number) {
        return Math.ceil(number);
    }

    /**
     * 
     * @param {number} number 
     * @returns {Vector}
     */
    round(numebr) {
        return Math.round(number);
    }
}