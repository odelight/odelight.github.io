import { TilePoint } from "./TilePoint.js";
export class Tetrad {
    constructor(type, x, y) {
        this.type = type;
        this.position = new TilePoint(x, y);
    }
}
