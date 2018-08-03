export class TouchRecord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.time = Date.now();
    }
    isOld() {
        return Date.now() - this.time > TouchRecord.doubleClickTimeout;
    }
    isInRangeOf(otherX, otherY) {
        var dx = (this.x - otherX);
        var dy = (this.y - otherY);
        var dist_squared = dx * dx + dy * dy;
        var inDistance = dist_squared < TouchRecord.doubleClickMaxDistance * TouchRecord.doubleClickMaxDistance;
        //       var inTime : boolean = Math.abs(this.time - other.time) < TouchRecord.doubleClickTimeout;
        //alert(this.time - other.time);
        //alert(TouchRecord.doubleClickMaxDistance*TouchRecord.doubleClickMaxDistance);
        return inDistance;
        //var notTooTimeClose = ;
    }
}
TouchRecord.doubleClickTimeout = 200;
//static minDoubleClickTime : number = 10;
TouchRecord.doubleClickMaxDistance = 40;
