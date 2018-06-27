import { TilePoint } from "./TilePoint.js";
export class PixelPoint {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    equals(other) {
        return (this.x == other.x && this.y == other.y);
    }
    asTilePoint(tileWidth, tileHeight) {
        return new TilePoint(Math.floor(this.x / tileWidth), Math.floor(this.y / tileHeight));
    }
}
PixelPoint.hashConstant = 10000;
