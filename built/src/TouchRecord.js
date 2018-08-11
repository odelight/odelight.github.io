export class TouchRecord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.time = Date.now();
    }
    isInRangeOf(otherX, otherY) {
        var dx = (this.x - otherX);
        var dy = (this.y - otherY);
        var dist_squared = dx * dx + dy * dy;
        var inDistance = dist_squared < TouchRecord.doubleClickMaxDistance * TouchRecord.doubleClickMaxDistance;
        return inDistance;
    }
}
TouchRecord.doubleClickTimeout = 200;
TouchRecord.doubleClickMaxDistance = 20;
