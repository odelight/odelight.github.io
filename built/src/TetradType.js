import { PointOffset } from "./PointOffset.js";
import { AttackType } from "./AttackType.js";
export class TetradType {
    constructor(name, offsetList, centerX, centerY, attackType) {
        this.name = name;
        this.offsetList = offsetList;
        this.centerX = centerX;
        this.centerY = centerY;
        this.attackType = attackType;
    }
    static getRandomTetrad() {
        var N = tetradTypes.length;
        var i = Math.floor(Math.random() * N);
        return tetradTypes[i];
        //return tetradO;
    }
    static rotateTetrad(T) {
        var rotatedList = [];
        for (var i = 0; i < T.offsetList.length; i++) {
            rotatedList[i] = T.offsetList[i].rotate();
        }
        return new TetradType(T.name, rotatedList, T.centerY, -T.centerX, T.attackType);
    }
    static bigify(smallTetrad) {
        var smallOffsetList = smallTetrad.offsetList;
        var bigOffsetList = [];
        for (var i = 0; i < smallOffsetList.length; i++) {
            var x = smallOffsetList[i].xOffset;
            var y = smallOffsetList[i].yOffset;
            bigOffsetList.push(new PointOffset(2 * x, 2 * y));
            bigOffsetList.push(new PointOffset(2 * x, 2 * y + 1));
            bigOffsetList.push(new PointOffset(2 * x + 1, 2 * y));
            bigOffsetList.push(new PointOffset(2 * x + 1, 2 * y + 1));
        }
        return new TetradType(smallTetrad.name, bigOffsetList, 2 * smallTetrad.centerX, 2 * smallTetrad.centerY, smallTetrad.attackType.bigify());
    }
}
export var tetradO = new TetradType('O', [new PointOffset(0, 0), new PointOffset(1, 0), new PointOffset(1, 1), new PointOffset(0, 1)], 0.5, 0.5, new AttackType(50, 200, 50, 0.5, 500));
export var tetradI = new TetradType('I', [new PointOffset(0, 0), new PointOffset(0, 1), new PointOffset(0, 2), new PointOffset(0, 3)], 0.0, 1.5, new AttackType(160, 100, 40, 1, 0));
export var tetradS = new TetradType('S', [new PointOffset(1, 0), new PointOffset(2, 0), new PointOffset(0, 1), new PointOffset(1, 1)], 1.0, 0.5, new AttackType(100, 50, 20, 1, 0));
export var tetradZ = new TetradType('Z', [new PointOffset(0, 0), new PointOffset(1, 0), new PointOffset(1, 1), new PointOffset(2, 1)], 1.0, 0.5, new AttackType(100, 50, 20, 1, 0));
export var tetradL = new TetradType('L', [new PointOffset(0, 0), new PointOffset(0, 1), new PointOffset(0, 2), new PointOffset(1, 2)], 0.5, 1, new AttackType(40, 100, 10, 1, 0, true));
export var tetradJ = new TetradType('J', [new PointOffset(1, 0), new PointOffset(1, 1), new PointOffset(1, 2), new PointOffset(0, 2)], 1, 0.5, new AttackType(40, 100, 10, 1, 0, true));
export var tetradT = new TetradType('T', [new PointOffset(0, 0), new PointOffset(1, 0), new PointOffset(2, 0), new PointOffset(1, 1)], 1, 0.5, new AttackType(45, 20, 10, 1, 0));
export var tetradTypes = [tetradO, tetradI, tetradS, tetradZ, tetradL, tetradJ, tetradT];
export var bigTetradTypes = [TetradType.bigify(tetradO), TetradType.bigify(tetradI),
    TetradType.bigify(tetradS), TetradType.bigify(tetradZ), TetradType.bigify(tetradL),
    TetradType.bigify(tetradJ), TetradType.bigify(tetradT)];
