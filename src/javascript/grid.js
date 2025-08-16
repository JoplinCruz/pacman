

class Grid {

    /**
     * 
     * @param {number} row 
     * @param {number} column 
     */
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.rowSize = gridSize.width;
        this.renewId();
    }

    show() {
        return [this.floor(this.row), this.floor(this.column)];
    }

    up() {
        this.row -= 1;
        this.renewId();
    }
    
    down() {
        this.row += 1;
        this.renewId();
    }
    
    left() {
        this.column -= 1;
        this.renewId();
    }
    
    right() {
        this.column += 1;
        this.renewId();
    }

    /**
     * 
     * @param {number} row 
     * @param {number} column 
     */
    update(row, column) {
        this.row = row;
        this.column = column;
        this.renewId();
    }

    renewId() {
        this.id = this.floor(this.row) * this.rowSize + this.floor(this.column);
    }

    /**
     * 
     * @param {number} id 
     * @returns {Grid}
     */
    convertFromId(id) {
        return new Grid(this.floor(id / this.rowSize), id % this.rowSize);
    }

    /**
     * 
     * @param {number} row 
     * @param {number} column 
     * @returns {Grid}
     */
    create(row, column) {
        if (row && column) return new Grid(row, column);
        else return new Grid(this.row, this.column);
    }

    /**
     * 
     * @param {Grid | number} other 
     */
    add(other) {
        return other instanceof Grid ?
            new Grid(this.row + other.row, this.column + other.column) :
            new Grid(this.row + other, this.column + other);
    }

    /**
     * 
     * @param {Grid | number} other 
     */
    multiply(other) {
        return other instanceof Grid ?
            new Grid(this.row * other.row, this.column * other.column) :
            new Grid(this.row * other, this.column * other);
    }
    
    /**
     * 
     * @param {number} angle 
     */
    rotation(angle) {
        return new Grid(
            this.column * Math.sin(angle) + this.row * Math.cos(angle),
            this.column * Math.cos(angle) - this.row * Math.sin(angle)
        );
    }

    /**
     * 
     * @param {Grid} other 
     * @returns {Grid}
     */
    delta(other) {
        return arguments.length > 1 ?
            new Grid(arguments[1].row - arguments[0].row, arguments[1].column - arguments[0].column) :
            new Grid(other.row - this.row, other.column - this.column);
    }

    /**
     * 
     * @param {number} number 
     * @returns {Grid | number}
     */
    floor(number) {
        return typeof(number) === "number" ? 
            Math.floor(number) :
            new Grid(Math.floor(this.row), Math.floor(this.column));
    }

    /**
     * 
     * @param {number} number 
     * @returns {Grid | number}
     */
    ceil(number) {
        return typeof(number) === "number" ?
            Math.ceil(number) :
            new Grid(Math.ceil(this.row), Math.ceil(this.column));
    }

    /**
     * 
     * @param {number} number 
     * @returns {Grid | number}
     */
    round(number) {
        return typeof(number) === "number" ?
            Math.round(number) :
            new Grid(Math.round(this.row), Math.round(this.column));
    }
}