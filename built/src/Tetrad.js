import { Point } from "./Point.js";
export class Tetrad {
    constructor(type, x, y) {
        this.type = type;
        this.position = new Point(x, y);
    }
}
