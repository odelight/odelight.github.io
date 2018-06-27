import { Heap } from "./Heap.js";
import { TilePoint } from "./TilePoint.js";
import { PathingPoint } from "./PathingPoint.js";
import { PointOffset } from "./PointOffset.js";
import { PointSet } from "./PointSet.js";
import { PointMap } from "./PointMap.js";
export class Pathing {
    static fullPath(pathers, start) {
        var fullPath = [];
        for (var i = 0; i < pathers.length; i++) {
            var pathSegment = pathers[i].aStar(start);
            if (pathSegment == null) {
                return null;
            }
            fullPath = fullPath.concat(pathSegment);
            start = pathers[i].getEnd();
        }
        return fullPath;
    }
    resetMap(newMapGrid, end, newTetrad) {
        this.shittyPath(end, newMapGrid, newTetrad);
    }
    aStar(start) {
        return this.reconstructPath(start, this.cameFrom);
    }
    getEnd() {
        return this.end;
    }
    shittyPath(endPoint, mapGrid, tetrad) {
        this.boardWidth = mapGrid.width();
        this.boardHeight = mapGrid.height();
        this.mapGrid = mapGrid;
        this.cameFrom = new PointMap();
        this.end = endPoint;
        var closedSet = new PointSet();
        var scores = new PointMap();
        var openSetHeap = new Heap(function (a, b) {
            return a.score - b.score;
        });
        var end = new PathingPoint(endPoint, 0);
        openSetHeap.push(end);
        scores.put(endPoint, end.score);
        while (!openSetHeap.empty()) {
            var current = openSetHeap.pop();
            closedSet.add(current.pt);
            var neighbors = this.getNeighbors(current.pt, tetrad);
            for (var i = 0; i < neighbors.length; i++) {
                var n = neighbors[i];
                if (closedSet.has(n)) {
                    continue;
                }
                var tentativeScore = current.score + Pathing.straightDistance(current.pt, n);
                if (scores.has(n) && scores.get(n) <= tentativeScore) {
                    continue;
                }
                this.cameFrom.put(n, current.pt);
                scores.put(n, tentativeScore);
                openSetHeap.push({ pt: n, score: tentativeScore });
            }
        }
    }
    getNeighbors(node, tetrad) {
        var neighbors = [];
        var potentialNeighborOffsets = [new PointOffset(0, -1), new PointOffset(-1, 0),
            new PointOffset(1, 0), new PointOffset(0, 1)];
        var diagonalPotentialNeighborOffsets = [{ x: 1, y: 1, sub: [{ x: 1, y: 0 }, { x: 0, y: 1 }] },
            { x: 1, y: -1, sub: [{ x: 1, y: 0 }, { x: 0, y: -1 }] },
            { x: -1, y: -1, sub: [{ x: -1, y: 0 }, { x: 0, y: -1 }] },
            { x: -1, y: 1, sub: [{ x: -1, y: 0 }, { x: 0, y: 1 }] }];
        for (var i = 0; i < potentialNeighborOffsets.length; i++) {
            var pos = potentialNeighborOffsets[i].offset(node);
            if (!this.isPointBlocked(pos, tetrad)) {
                neighbors.push(pos);
            }
        }
        for (var i = 0; i < diagonalPotentialNeighborOffsets.length; i++) {
            var potentialNeighbor = diagonalPotentialNeighborOffsets[i];
            var pos = new TilePoint(node.x + potentialNeighbor.x, node.y + potentialNeighbor.y);
            if (!this.isPointBlocked(pos, tetrad)) {
                for (var j = 0; j < potentialNeighbor.sub.length; j++) {
                    var subPos = new TilePoint(node.x + potentialNeighbor.sub[j].x, node.y + potentialNeighbor.sub[j].y);
                    if (!this.isPointBlocked(subPos, tetrad)) {
                        neighbors.push(pos);
                        break;
                    }
                }
            }
        }
        return neighbors;
    }
    isPointBlocked(point, tetrad) {
        var xPos = point.x;
        var yPos = point.y;
        if (xPos < 0 || xPos >= this.boardWidth || yPos < 0 || yPos >= this.boardHeight || this.mapGrid.isBlocked(point)) {
            return true;
        }
        if (tetrad != null) {
            return this.isPointInTetrad(point, tetrad);
        }
        return false;
    }
    isPointInTetrad(point, tetrad) {
        for (var i = 0; i < tetrad.type.offsetList.length; i++) {
            if (point.equals(tetrad.type.offsetList[i].offset(tetrad.position))) {
                return true;
            }
        }
        return false;
    }
    reconstructPath(current, cameFrom) {
        var path = [];
        path.push(current);
        while (cameFrom.has(current)) {
            var newPoint = cameFrom.get(current);
            if (newPoint == null) {
                throw "Point is undefined! (Point: " + TilePoint + ")";
            }
            current = newPoint;
            path.push(current);
        }
        if (current == this.end) {
            return path;
        }
        return null;
    }
    static straightDistance(start, end) {
        var dx = Math.abs(start.x - end.x);
        var dy = Math.abs(start.y - end.y);
        return Math.max(dx, dy) + 0.414 * (Math.min(dx, dy));
    }
}
