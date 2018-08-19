import { AttackType } from "./AttackType.js";
import { TetradTile } from "./TetradTile.js";
export class TetradType {
    constructor(name, centerX, centerY, attackType, offsetList, isBig = false) {
        this.name = name;
        this.centerX = centerX;
        this.centerY = centerY;
        this.attackType = attackType;
        this.isBig = isBig;
        this.offsetList = offsetList;
    }
    static rotateTetrad(T) {
        var rotatedList = [];
        for (var i = 0; i < T.offsetList.length; i++) {
            rotatedList[i] = T.offsetList[i].rotate();
        }
        return new TetradType(T.name, T.centerY, -T.centerX, T.attackType, rotatedList, T.isBig);
    }
    static bigify(smallTetrad) {
        var smallOffsetList = smallTetrad.offsetList;
        var bigOffsetList = [];
        for (var i = 0; i < smallOffsetList.length; i++) {
            var x = smallOffsetList[i].x;
            var y = smallOffsetList[i].y;
            bigOffsetList.push(TetradTile.getTetradTileFromCoords(2 * x, 2 * y, 2, 2));
        }
        return new TetradType(smallTetrad.name, 2 * smallTetrad.centerX, 2 * smallTetrad.centerY, smallTetrad.attackType.bigify(), bigOffsetList, true);
    }
    get blockedList() {
        return this.offsetList.map(x => x.blockedTiles).reduce((x, y) => x.concat(y));
    }
    static unrotate(tetrad) {
        var result = this.getTetradType(tetrad.name);
        if (result == null) {
            throw "TetradType does not have valid name: " + tetrad.name;
        }
        return result;
    }
    static getTetradType(name) {
        for (var type of tetradTypes) {
            if (type.name == name) {
                return type;
            }
        }
        return null;
    }
}
export var tetradO = new TetradType('O', 0.5, 0.5, new AttackType(200, 200, 50, 0.5, 500), [TetradTile.getTetradTileFromCoords(0, 0), TetradTile.getTetradTileFromCoords(1, 0), TetradTile.getTetradTileFromCoords(1, 1), TetradTile.getTetradTileFromCoords(0, 1)]);
export var tetradI = new TetradType('I', 0.0, 1.5, new AttackType(200, 100, 40, 1, 0), [TetradTile.getTetradTileFromCoords(0, 0), TetradTile.getTetradTileFromCoords(0, 1), TetradTile.getTetradTileFromCoords(0, 2), TetradTile.getTetradTileFromCoords(0, 3)]);
export var tetradS = new TetradType('S', 1.0, 0.5, new AttackType(100, 50, 20, 1, 0), [TetradTile.getTetradTileFromCoords(1, 0), TetradTile.getTetradTileFromCoords(2, 0), TetradTile.getTetradTileFromCoords(0, 1), TetradTile.getTetradTileFromCoords(1, 1)]);
export var tetradZ = new TetradType('Z', 1.0, 0.5, new AttackType(100, 50, 20, 1, 0), [TetradTile.getTetradTileFromCoords(0, 0), TetradTile.getTetradTileFromCoords(1, 0), TetradTile.getTetradTileFromCoords(1, 1), TetradTile.getTetradTileFromCoords(2, 1)]);
export var tetradL = new TetradType('L', 0.5, 1, new AttackType(20, 100, 10, 1, 0, true), [TetradTile.getTetradTileFromCoords(0, 0), TetradTile.getTetradTileFromCoords(0, 1), TetradTile.getTetradTileFromCoords(0, 2), TetradTile.getTetradTileFromCoords(1, 2)]);
export var tetradJ = new TetradType('J', 1, 0.5, new AttackType(20, 100, 10, 1, 0, true), [TetradTile.getTetradTileFromCoords(1, 0), TetradTile.getTetradTileFromCoords(1, 1), TetradTile.getTetradTileFromCoords(1, 2), TetradTile.getTetradTileFromCoords(0, 2)]);
export var tetradT = new TetradType('T', 1, 0.5, new AttackType(45, 20, 10, 1, 0), [TetradTile.getTetradTileFromCoords(0, 0), TetradTile.getTetradTileFromCoords(1, 0), TetradTile.getTetradTileFromCoords(2, 0), TetradTile.getTetradTileFromCoords(1, 1)]);
export var tetradTypes = [tetradO, tetradI, tetradS, tetradZ, tetradL, tetradJ, tetradT];
export var bigTetradTypes = [TetradType.bigify(tetradO), TetradType.bigify(tetradI),
    TetradType.bigify(tetradS), TetradType.bigify(tetradZ), TetradType.bigify(tetradL),
    TetradType.bigify(tetradJ), TetradType.bigify(tetradT)];
