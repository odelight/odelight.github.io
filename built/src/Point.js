export class Point {
    constructor(x, y) {
        if (x > Point.hashConstant || y > Point.hashConstant) {
            throw "Point hashing function will no longer properly work; x or y greater than hashConstant.";
        }
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    hash() {
        return Point.hashConstant * this.x + this.y;
    }
    static unhash(hash) {
        var y = hash % this.hashConstant;
        var x = (hash - y) / this.hashConstant;
        return new Point(x, y);
    }
    equals(other) {
        return (this.x == other.x && this.y == other.y);
    }
}
Point.hashConstant = 10000;
