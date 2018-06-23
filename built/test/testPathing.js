import { Pathing } from "../src/Pathing.js";
import { MapGrid } from "../src/MapGrid.js";
import { Point } from "../src/Point.js";
import { TestUtils } from "./testUtils.js";
export class TestPathing {
    static testPathing() {
        var pathing = new Pathing();
        var boardWidth = 3;
        var boardHeight = 2;
        var mapGrid = new MapGrid(boardWidth, boardHeight);
        pathing.resetMap(mapGrid, new Point(2, 0), null);
        var path = pathing.aStar(new Point(0, 0));
        if (path == null) {
            throw "Null path returned";
        }
        TestUtils.assertEquals(path[0].x, 0);
        TestUtils.assertEquals(path[0].y, 0);
        TestUtils.assertEquals(path[1].x, 1);
        TestUtils.assertEquals(path[1].y, 0);
        TestUtils.assertEquals(path[2].x, 2);
        TestUtils.assertEquals(path[2].y, 0);
        var path2 = pathing.aStar(new Point(0, 0));
        if (path2 == null) {
            throw "Null path returned";
        }
        TestUtils.assertEquals(path2[0].x, 0);
        TestUtils.assertEquals(path2[0].y, 0);
        TestUtils.assertEquals(path2[1].x, 1);
        TestUtils.assertEquals(path2[1].y, 0);
        TestUtils.assertEquals(path2[2].x, 2);
        TestUtils.assertEquals(path2[2].y, 0);
        mapGrid.setBlocked(new Point(1, 0));
        pathing.resetMap(mapGrid, new Point(2, 0), null);
        path = pathing.aStar(new Point(0, 0));
        if (path == null) {
            throw "Null path returned";
        }
        TestUtils.assertEquals(path[0].x, 0);
        TestUtils.assertEquals(path[0].y, 0);
        TestUtils.assertEquals(path[1].x, 1);
        TestUtils.assertEquals(path[1].y, 1);
        TestUtils.assertEquals(path[2].x, 2);
        TestUtils.assertEquals(path[2].y, 0);
        path2 = pathing.aStar(new Point(0, 0));
        if (path2 == null) {
            throw "Null path returned";
        }
        TestUtils.assertEquals(path2[0].x, 0);
        TestUtils.assertEquals(path2[0].y, 0);
        TestUtils.assertEquals(path2[1].x, 1);
        TestUtils.assertEquals(path2[1].y, 1);
        TestUtils.assertEquals(path2[2].x, 2);
        TestUtils.assertEquals(path2[2].y, 0);
        return "Pathing tests passed!";
    }
}
