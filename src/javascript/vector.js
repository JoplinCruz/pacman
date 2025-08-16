

class Vector {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = windowSize.width;
        this.height = windowSize.height;
        this.blocksize = blocksize;
        this.grid = new Grid(this.y / this.blocksize, this.x * this.blocksize);
        this.gridUpdate();
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    change(x, y) {
        this.x = x;
        this.y = y;

        this.gridUpdate();
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {Vector}
     */
    create(x, y) {
        if (x && y) return new Vector(x, y);
        else return new Vector(this.x, this.y);
    }

    /**
     * 
     * @param {Grid} grid 
     */
    updateFromGrid(grid) {
        if (grid) {
            this.x = grid.multiply(this.blocksize).column;
            this.y = grid.multiply(this.blocksize).row;
        } else {
            this.x = this.grid.multiply(this.blocksize).column;
            this.y = this.grid.multiply(this.blocksize).row;
        }

        this.gridUpdate()
    }

    /**
     * 
     * @param {Grid} grid 
     * @returns {Vector} 
     */
    convertFromGrid(grid) {
        return new Vector(grid.multiply(this.blocksize).column, grid.multiply(this.blocksize).row);
    }

    gridUpdate() {
        this.grid.update(this.y / this.blocksize, this.x / this.blocksize);
    }

    /**
     * 
     * @param {number} step 
     */
    up(step) {
        this.y -= step;
        this.gridUpdate();
    }

    /**
     * 
     * @param {number} step 
     */
    down(step) {
        this.y += step;
        this.gridUpdate()
    }
    
    /**
     * 
     * @param {number} step 
     */
    left(step) {
        this.x -= step;
        this.gridUpdate();
    }
    
    /**
     * 
     * @param {number} step 
     */
    right(step) {
        this.x += step;
        this.gridUpdate();
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
    collision(target) {
        return this.grid.floor().row === target.grid.ceil().row &&
            this.grid.ceil().column === target.grid.floor().column ||
            this.grid.ceil().row === target.grid.floor().row &&
            this.grid.floor().column === target.grid.ceil().column;
    }

    /**
     * 
     * @param {Vector | number} other 
     * @returns {Vector}
     */
    add(other) {
        return other instanceof Vector ?
            new Vector(this.x + other.x, this.y + other.y) :
            new Vector(this.x + other, this.y + other);
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
        let delta = arguments.length > 1 ? this.delta(arguments[0], arguments[1]) : this.delta(target);
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
     * @param {number} number 
     * @returns {Vector | number}
     */
    floor(number) {
        return typeof(number) === "number" ?
            Math.floor(number) :
            new Grid(Math.floor(this.x), Math.floor(this.y));
    }

    /**
     * 
     * @param {number} number 
     * @returns {Vector | number}
     */
    ceil(number) {
        return typeof(number) === "number" ?
            Math.ceil(number) :
            new Grid(Math.ceil(this.x), Math.ceil(this.y));
    }

    /**
     * 
     * @param {number} number 
     * @returns {Vector | number}
     */
    round(number) {
        return typeof(number) === "number" ?
            Math.round(number) :
            new Grid(Math.round(this.x), Math.round(this.y));
    }
}