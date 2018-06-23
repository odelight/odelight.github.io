import { Point } from "../src/Point.js";
import { Tetrad } from "../src/Tetrad.js";
import { tetradO } from "../src/TetradType.js";
import { Combo } from "../src/Combo.js";
import { TestUtils } from "./TestUtils.js";
import { PointSet } from "../src/PointSet.js";
export class TestCombo {
    static testCombo() {
        this.testTetradInBig();
        this.testTetradInBig2();
        this.testCheckForBigTetrad();
        this.testDetectCombosO();
        this.testDetectCombosTiltedI();
        return "Combo tests passed!";
    }
    static testTetradInBig() {
        var bigTetradHashSet = new PointSet();
        bigTetradHashSet.add(new Point(0, 0));
        bigTetradHashSet.add(new Point(0, 1));
        bigTetradHashSet.add(new Point(1, 0));
        bigTetradHashSet.add(new Point(1, 1));
        var t = new Tetrad(tetradO, 0, 0);
        TestUtils.assertTrue(Combo.tetradInBig(bigTetradHashSet, t));
    }
    static testTetradInBig2() {
        var bigTetradHashSet = new PointSet();
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 2; j++) {
                bigTetradHashSet.add(new Point(i, j));
            }
        }
        for (var i = 0; i < 4; i++) {
            TestUtils.assertTrue(Combo.tetradInBig(bigTetradHashSet, new Tetrad(tetradO, 2 * i, 0)));
        }
    }
    static testCheckForBigTetrad() {
    }
    static testDetectCombosO() {
        var tetradList = [];
        tetradList.push(new Tetrad(tetradO, 0, 0));
        tetradList.push(new Tetrad(tetradO, 2, 0));
        tetradList.push(new Tetrad(tetradO, 0, 2));
        var combo = Combo.detectCombos(new Tetrad(tetradO, 2, 2), tetradList);
        TestUtils.assertNotNull(combo);
    }
    static testDetectCombosTiltedI() {
        var tetradList = [];
        tetradList.push(new Tetrad(tetradO, 0, 0));
        tetradList.push(new Tetrad(tetradO, 2, 0));
        tetradList.push(new Tetrad(tetradO, 4, 0));
        var combo = Combo.detectCombos(new Tetrad(tetradO, 6, 0), tetradList);
        TestUtils.assertNotNull(combo);
    }
}
