import { PixelPoint } from "./PixelPoint.js";
import { Pathing } from "./Pathing.js";
export class PathingObject {
    constructor(wayPoints, position, pathers, tileWidth, tileHeight) {
        this.wayPoints = wayPoints;
        this._pixelPosition = position.asPixelPoint(tileWidth, tileHeight);
        this.pathers = pathers;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.targetWayPointIndex = 0;
        var track = this.pathers[0].aStar(position);
        if (track == null) {
            throw "Unable to create initial track";
        }
        this.track = track;
    }
    get pixelPosition() {
        return this._pixelPosition;
    }
    //Returns true if enemy reached the end, false otherwise.
    update(speed) {
        if (this.track.length == 0) {
            this.targetWayPointIndex = this.targetWayPointIndex + 1;
            if (this.targetWayPointIndex >= this.wayPoints.length) {
                return true;
            }
            if (!this.recalculateCurrentTrack()) {
                throw "Unexpectedly could not calculate path!";
            }
        }
        var pixelNextTrackpoint = this.track[0].asPixelPoint(this.tileWidth, this.tileHeight);
        var dx = pixelNextTrackpoint.x - this.pixelPosition.x;
        var dy = pixelNextTrackpoint.y - this.pixelPosition.y;
        var dist = Pathing.straightDistance(this.pixelPosition, pixelNextTrackpoint);
        if (dist < speed) {
            var nextTrackPoint = this.track.shift();
            if (nextTrackPoint == null) {
                throw "Unexpectedly undefined track!";
            }
            this._pixelPosition = nextTrackPoint.asPixelPoint(this.tileWidth, this.tileHeight);
        }
        else {
            this._pixelPosition = new PixelPoint(this.pixelPosition.x + (dx / dist) * speed, this.pixelPosition.y + (dy / dist) * speed);
        }
        return false;
    }
    setPathers(pathers) {
        this.pathers = pathers;
        this.recalculateCurrentTrack();
        //Path is from pathers rounded position, but we don't want him to move backwards; trim start of path off (if the path is length 1, don't cause weird exceptions tho).
        if (this.track.length > 1) {
            this.track.shift();
        }
    }
    recalculateCurrentTrack() {
        var currentPather = this.pathers[this.targetWayPointIndex];
        var track = currentPather.aStar(this.pixelPosition.asTilePoint(this.tileWidth, this.tileHeight));
        if (track == null) {
            return false;
        }
        this.track = track;
        return true;
    }
}
