export class MapGrid {
    constructor(boardWidth, boardHeight) {
        this.internalGrid = new Array();
        for (var i = 0; i < boardWidth; i++) {
            this.internalGrid[i] = new Array();
            for (var j = 0; j < boardHeight; j++) {
                this.internalGrid[i][j] = MapGrid.BLANK_SPACE;
            }
        }
    }
    height() {
        return this.internalGrid[0].length;
    }
    width() {
        return this.internalGrid.length;
    }
    isBlocked(point) {
        return this.internalGrid[point.x][point.y] == MapGrid.BLOCK_SPACE;
    }
    setBlocked(point) {
        this.internalGrid[point.x][point.y] = MapGrid.BLOCK_SPACE;
    }
}
MapGrid.BLOCK_SPACE = 0;
MapGrid.BLANK_SPACE = 1;
