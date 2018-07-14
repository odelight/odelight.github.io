import { TilePoint } from "./TilePoint.js";
export class TileOffset {
    constructor(x, y) {
        this.xOffset = x;
        this.yOffset = y;
    }
    offset(input) {
        return new TilePoint(input.x + this.xOffset, input.y + this.yOffset);
    }
}
