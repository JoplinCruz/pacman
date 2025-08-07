

class Vector {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} blocksize
     */
    constructor(x, y, blocksize) {
        this.x = x;
        this.y = y;
        this.blocksize = blocksize;
        this.toCoordinate();
    }

    /**
     * 
     * @param {Vector | number} other 
     * @returns {Vector}
     */
    add(other) {
        let vector = typeof (other) === "Vector" ?
            new Vector(this.x + other.x, this.y + other.y) :
            vector = new Vector(this.x + other, this.y * other);
        return vector;
    }

    /**
     * 
     * @param {Vector | number} other 
     * @returns {Vector}
     */
    multiply(other) {
        let vector = typeof (other) === "Vector" ?
            new Vector(this.x * other.x, this.y * other.y) :
            new Vector(this.x * other, this.y * other);
        return vector;
    }

    /**
     * 
     * @param {Vector} target 
     * @returns {Vector}
     */
    delta(target) {
        let vector = arguments.length > 1 ?
            new Vector(arguments[1].x - arguments[0].x, arguments[1].y - arguments[0].y) :
            new Vector(target.x - this.x, target.y - this.y);
        return vector;
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
        let delta = arguments.length > 1 ? this.delta(arguments[0], arguments[1]) : this.delta(target);
        a = delta.x;
        b = delta.y;
        c = arguments.length > 1 ? this.distance(arguments[0], arguments[1]) : this.distance(target);
        return new Vector(a / c, b / c);
    }

    /**
     * 
     * @returns {number[]}
     */
    getCoordinate() {
        return [this.coordinate.row, this.coordinate.column];
    }

    /**
     * 
     * @returns {number[]}
     */
    toCoordinate() {
        let coordinate = this.multiply(1 / this.blocksize).floor();
        this.coordinate = {
            row: coordinate.y,
            column: coordinate.x
        };
        return [this.coordinate.row, this.coordinate.column];
    }

    /**
     * 
     * @param {number[]} coordinate 
     * @returns {Vector}
     */
    toPosition(coordinate) {
        return new Vector(coordinate[1], coordinate[0]).multiply(this.blocksize);
    }

    /**
     * 
     * @param {number} angle 
     * @returns {Vector}
     */
    rotation(angle) {
        return new Vector(
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.x * Math.sin(angle) + this.y * Math.cos(angle)
        ).round();
    }

    /**
     * 
     * @param {Vector | undefined} vector 
     * @returns {Vector}
     */
    floor(vector) {
        return vector ?
            new Vector(Math.floor(vector.x), Math.floor(vector.y)) :
            new Vector(Math.floor(this.x), Math.floor(this.y));
    }

    /**
     * 
     * @param {Vector | undefined} vector 
     * @returns {Vector}
     */
    ceil(vector) {
        return vector ?
            new Vector(Math.ceil(vector.x), Math.ceil(vector.y)) :
            new Vector(Math.ceil(this.x), Math.ceil(this.y));
    }

    /**
     * 
     * @param {Vector | undefined} vector 
     * @returns {Vector}
     */
    round(vector) {
        return vector ?
            new Vector(Math.round(vector.x), Math.round(vector.y)) :
            new Vector(Math.round(this.x), Math.round(this.y));
    }
}