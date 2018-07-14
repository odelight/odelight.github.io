import { Tetrad } from "./Tetrad.js";
import { TetradType, bigTetradTypes } from "./TetradType.js";
import { PointSet } from "./PointSet.js";
export class Combo {
    constructor(bigTetrad, components) {
        this.bigTetrad = bigTetrad;
        this.components = components;
    }
    static detectCombos(newTetrad, tetradList) {
        var filteredTetradList = Combo.filterTetradList(newTetrad, tetradList);
        var bigTetradsToCheck = [];
        for (var i = 0; i < bigTetradTypes.length; i++) {
            var tetradType = bigTetradTypes[i];
            for (var j = 0; j < 4; j++) {
                bigTetradsToCheck.push(tetradType);
                tetradType = TetradType.rotateTetrad(tetradType);
            }
        }
        for (var i = 0; i < bigTetradsToCheck.length; i++) {
            var bigTetradType = bigTetradsToCheck[i];
            var ret = Combo.checkForBigTetrad(bigTetradType, newTetrad, tetradList);
            if (ret != null) {
                return ret;
            }
        }
        return null;
    }
    static checkForBigTetrad(bigTetradType, newTetrad, tetradList) {
        var tetradsThatWillBe = tetradList.slice(0);
        tetradsThatWillBe.push(newTetrad);
        var newTetradPoint = newTetrad.type.blockedList[0].offset(newTetrad.position);
        for (var i = 0; i < bigTetradType.blockedList.length; i++) {
            var bigOffset = bigTetradType.blockedList[i];
            var bigTetradX = newTetradPoint.x - bigOffset.xOffset;
            var bigTetradY = newTetradPoint.y - bigOffset.yOffset;
            var bigTetrad = new Tetrad(bigTetradType, bigTetradX, bigTetradY);
            var tetradsInBig = Combo.tetradsInBig(bigTetrad, tetradsThatWillBe);
            if (tetradsInBig.length == 4) {
                return new Combo(bigTetrad, tetradsInBig);
            }
        }
        return null;
    }
    static tetradsInBig(bigTetrad, tetradList) {
        var tetradsInBig = [];
        var bigSquareSet = new PointSet();
        for (var i = 0; i < bigTetrad.type.blockedList.length; i++) {
            bigSquareSet.add(bigTetrad.type.blockedList[i].offset(bigTetrad.position));
        }
        for (var i = 0; i < tetradList.length; i++) {
            if (Combo.tetradInBig(bigSquareSet, tetradList[i])) {
                tetradsInBig.push(tetradList[i]);
            }
        }
        return tetradsInBig;
    }
    static tetradInBig(bigTetradSet, tetrad) {
        for (var j = 0; j < tetrad.type.blockedList.length; j++) {
            var tetradPoint = tetrad.type.blockedList[j].offset(tetrad.position);
            if (!bigTetradSet.has(tetradPoint)) {
                return false;
            }
        }
        return true;
    }
    static filterTetradList(newTetrad, tetradList) {
        var returnList = [];
        for (var i = 0; i < tetradList.length; i++) {
            if (Combo.checkTetradDistance(newTetrad, tetradList[i])) {
                returnList.push(tetradList[i]);
            }
        }
        return returnList;
    }
    static checkTetradDistance(newTetrad, otherTetrad) {
        var maxDist = 7;
        for (var j = 0; j < otherTetrad.type.blockedList.length; j++) {
            var other = otherTetrad.type.blockedList[j].offset(otherTetrad.position);
            var xDist = Math.abs(newTetrad.position.x - other.x);
            var yDist = Math.abs(newTetrad.position.y - other.y);
            if (xDist > maxDist || yDist > maxDist) {
                return false;
            }
        }
        return true;
    }
}
