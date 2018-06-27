import { PixelPoint } from "./PixelPoint.js";
export class TilePoint {
    constructor(x, y) {
        if (x > TilePoint.hashConstant || y > TilePoint.hashConstant) {
            throw "Point hashing function will no longer properly work; x or y greater than hashConstant.";
        }
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            throw "TilePoints only valid for integer inputs!";
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
        return TilePoint.hashConstant * this.x + this.y;
    }
    static unhash(hash) {
        var y = hash % this.hashConstant;
        var x = (hash - y) / this.hashConstant;
        return new TilePoint(x, y);
    }
    equals(other) {
        return (this.x == other.x && this.y == other.y);
    }
    asPixelPoint(tileWidth, tileHeight) {
        return new PixelPoint((this.x + 0.5) * tileWidth, (this.y + 0.5) * tileHeight);
    }
}
TilePoint.hashConstant = 10000;
