import { TileOffset } from "./TileOffset.js";
export class TetradTile {
    constructor() {
        this.blockedTiles = [];
    }
    static getTetradTileFromCoords(topLeftX, topLeftY, width = 1, height = 1) {
        var result = new TetradTile();
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                result.blockedTiles.push(new TileOffset(topLeftX + i, topLeftY + j));
            }
        }
        return result;
    }
    static getTetradTileFromTileList(blockedTiles) {
        var result = new TetradTile();
        result.blockedTiles = blockedTiles;
        return result;
    }
    TetradTile() {
    }
    get x() {
        var result = Number.POSITIVE_INFINITY;
        for (var i = 0; i < this.blockedTiles.length; i++) {
            result = Math.min(result, this.blockedTiles[i].xOffset);
        }
        return result;
    }
    get y() {
        var result = Number.POSITIVE_INFINITY;
        for (var i = 0; i < this.blockedTiles.length; i++) {
            result = Math.min(result, this.blockedTiles[i].yOffset);
        }
        return result;
    }
    rotate() {
        var newBlockedTiles = [];
        for (var i = 0; i < this.blockedTiles.length; i++) {
            newBlockedTiles.push(new TileOffset(this.blockedTiles[i].yOffset, -this.blockedTiles[i].xOffset));
        }
        return TetradTile.getTetradTileFromTileList(newBlockedTiles);
    }
}
