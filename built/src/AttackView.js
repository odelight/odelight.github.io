import { Point } from "./Point.js";
export class AttackView {
    constructor(start, end, image, duration) {
        this.image = image;
        this.duration = duration;
        this.timeCounter = 0;
        this.steps = AttackView.makeSteps(start, end, duration);
    }
    static makeSteps(start, end, steps) {
        var xStep = (end.x - start.x) / steps;
        var yStep = (end.y - start.y) / steps;
        var result = [];
        for (var i = 0; i <= steps; i++) {
            result.push(new Point(start.x + xStep * i, start.y + yStep * i));
        }
        return result;
    }
    renderAndUpdate(ctx) {
        if (this.timeCounter > this.duration) {
            return false;
        }
        this.drawImage(ctx, this.steps[this.timeCounter]);
        this.timeCounter++;
        return true;
    }
    drawImage(ctx, position) {
        ctx.drawImage(this.image, position.x, position.y);
    }
}
