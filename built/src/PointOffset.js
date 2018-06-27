import { TilePoint } from "./TilePoint.js";
export class PointOffset {
    constructor(x, y) {
        this.xOffset = x;
        this.yOffset = y;
    }
    offset(input) {
        return new TilePoint(input.x + this.xOffset, input.y + this.yOffset);
    }
    rotate() {
        return new PointOffset(this.yOffset, -this.xOffset);
    }
}
