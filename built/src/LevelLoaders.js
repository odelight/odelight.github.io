import { TilePoint } from "./TilePoint.js";
import { tetradO, tetradI, tetradL, tetradJ, tetradT, tetradZ, tetradS } from "./TetradType.js";
import { LevelBuilder } from "./LevelBuilder.js";
import { Util } from "./Util.js";
var canvas = Util.checkType(document.getElementById("gameCanvas"), HTMLCanvasElement);
export function populateLevelLoaders(levelLoaders = []) {
    var i = 0;
    levelLoaders[i++] = getBasicRandomLevel;
    levelLoaders[i++] = getCupLevel;
    levelLoaders[i++] = getJawsLevel;
    levelLoaders[i++] = getCurlELevel;
    levelLoaders[i++] = getThreebarLevel;
    levelLoaders[i++] = getZLevel;
    levelLoaders[i++] = getCenterSquareLevel;
    levelLoaders[i++] = getFigureEightLevel;
    levelLoaders[i++] = getNineSquareLevel;
    levelLoaders[i++] = getPowerButtonLevel2;
    levelLoaders[i++] = getFourSquareLevel;
    levelLoaders[i++] = getCircuitWithSTetrads;
    levelLoaders[i++] = getQuadCupLevel;
    levelLoaders[i++] = getNineSquareLevel2;
    levelLoaders[i++] = getPowerButtonLevel;
    levelLoaders[i++] = getDeathStarLevel;
    return levelLoaders;
}
function getBasicRandomLevel() {
    var spawnTimes = [];
    for (var i = 0; i <= 4; i++) {
        spawnTimes.push(i * 150);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([spawnTimes, [], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1), new TilePoint(39, 39), new TilePoint(1, 39)])
        .withCanvas(canvas)
        .withTetradList(([tetradS, tetradT, tetradJ, tetradO, tetradI, tetradZ, tetradL, tetradS, tetradT, tetradJ, tetradO, tetradI, tetradZ, tetradL]))
        .withBlackPoints([])
        .build();
    return level;
}
function getZLevel() {
    var spawnTimes = [];
    for (var i = 0; i <= 6; i++) {
        spawnTimes.push(i * 100);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([[], spawnTimes, []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1), new TilePoint(1, 39), new TilePoint(39, 39)])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradI], 12))
        .withBlackPoints([])
        .build();
    return level;
}
function getCircuitWithSTetrads() {
    var spawnTimes = [];
    for (var i = 1; i <= 32; i++) {
        spawnTimes.push(10 * i);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([spawnTimes, [], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(1, 39), new TilePoint(39, 39), new TilePoint(39, 1), new TilePoint(2, 1)])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradS], 40))
        .withBlackPoints([])
        .build();
    return level;
}
function getCurlELevel() {
    var bSpawnTimes = [];
    for (var i = 1; i <= 15; i++) {
        bSpawnTimes.push(i * 50);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([[], bSpawnTimes, []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(1, 30), new TilePoint(30, 30), new TilePoint(30, 10), new TilePoint(10, 10), new TilePoint(10, 39), new TilePoint(39, 39)])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradZ], 40))
        .withBlackPoints([])
        .build();
    return level;
}
function getCupLevel() {
    var spawnTimes = [];
    for (var i = 1; i <= 4; i++) {
        spawnTimes.push(i * (50 - i));
    }
    var blackPoints = [];
    for (var i = 0; i <= 20; i++) {
        blackPoints.push(new TilePoint(10, 10 + i));
        blackPoints.push(new TilePoint(10 + i, 30));
        blackPoints.push(new TilePoint(30, 30 - i));
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([spawnTimes, [], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1)])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradI], 16))
        .withBlackPoints(blackPoints)
        .build();
    return level;
}
function getThreebarLevel() {
    var aSpawnTimes = [];
    var bSpawnTimes = [];
    for (var i = 1; i <= 24; i++) {
        aSpawnTimes.push(i * 30);
        if (i > 10) {
            bSpawnTimes.push(135 + i * 30);
        }
    }
    var blackPoints = [];
    for (var i = 0; i <= 31; i++) {
        blackPoints.push(new TilePoint(4 + i, 10));
        blackPoints.push(new TilePoint(4 + i, 20));
        blackPoints.push(new TilePoint(4 + i, 30));
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([aSpawnTimes, bSpawnTimes, []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(20, 1), new TilePoint(20, 39)])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradO], 36))
        .withBlackPoints(blackPoints)
        .withEnemySpawnPoint(new TilePoint(20, 0))
        .build();
    return level;
}
function getCenterSquareLevel() {
    var spawnTimes = [];
    for (var i = 1; i <= 50; i++) {
        spawnTimes.push(i * 20);
    }
    var blackPoints = [];
    for (var i = 0; i <= 23; i++) {
        blackPoints.push(new TilePoint(8 + i, 8));
        blackPoints.push(new TilePoint(8 + i, 31));
        blackPoints.push(new TilePoint(8, 8 + i));
        blackPoints.push(new TilePoint(31, 8 + i));
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([spawnTimes, [], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(1, 39), new TilePoint(39, 39), new TilePoint(39, 1), new TilePoint(2, 1)])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradL], 20))
        .withBlackPoints(blackPoints)
        .build();
    return level;
}
function getPepperedLevel() {
    var cSpawnTimes = [];
    for (var i = 1; i <= 4; i++) {
        cSpawnTimes.push(i * 15);
    }
    var blackPoints = [];
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 20; j++)
            blackPoints.push(new TilePoint(3 + 7 * i, 2 * j + 1));
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([[], [], cSpawnTimes])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1), new TilePoint(39, 39), new TilePoint(1, 39), new TilePoint(1, 2)])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradL, tetradJ], 24))
        .withBlackPoints(blackPoints)
        .build();
    return level;
}
function getFigureEightLevel() {
    var spawnTimes = [];
    for (var i = 1; i <= 4; i++) {
        spawnTimes.push(i * 25);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([[], [], spawnTimes])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(19, 1), new TilePoint(11, 9), new TilePoint(29, 27), new TilePoint(20, 36), new TilePoint(11, 27), new TilePoint(29, 9), new TilePoint(21, 1)])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradT], 40))
        .withBlackPoints([])
        .withEnemySpawnPoint(new TilePoint(20, 1))
        .build();
    return level;
}
function getNineSquareLevel() {
    var blackPoints = [];
    for (var outerI = 0; outerI < 3; outerI++) {
        for (var outerJ = 0; outerJ < 3; outerJ++) {
            var xTopLeft = 3 + 12 * outerI;
            var yTopLeft = 3 + 12 * outerJ;
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    if (Math.max(i, j) == 9 || Math.min(i, j) == 0) {
                        blackPoints.push(new TilePoint(xTopLeft + i, yTopLeft + j));
                    }
                }
            }
        }
    }
    var spawnTimes = [];
    for (var i = 1; i <= 45; i++) {
        spawnTimes.push(i * 35);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([spawnTimes, [], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([
        new TilePoint(1, 1), new TilePoint(13, 1), new TilePoint(26, 1), new TilePoint(38, 1),
        new TilePoint(38, 13), new TilePoint(26, 13), new TilePoint(13, 13), new TilePoint(1, 13),
        new TilePoint(1, 26), new TilePoint(13, 26), new TilePoint(26, 26), new TilePoint(38, 26),
        new TilePoint(38, 38), new TilePoint(26, 38), new TilePoint(13, 38), new TilePoint(1, 38)
    ])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradO], 12))
        .withBlackPoints(blackPoints)
        .build();
    return level;
}
function getFourSquareLevel() {
    var blackPoints = [];
    for (var outerI = 0; outerI < 2; outerI++) {
        for (var outerJ = 0; outerJ < 2; outerJ++) {
            var xTopLeft = 4 + 18 * outerI;
            var yTopLeft = 4 + 18 * outerJ;
            for (var i = 0; i < 14; i++) {
                for (var j = 0; j < 14; j++) {
                    if (Math.max(i, j) == 13 || Math.min(i, j) == 0) {
                        blackPoints.push(new TilePoint(xTopLeft + i, yTopLeft + j));
                    }
                }
            }
        }
    }
    var spawnTimes = [];
    for (var i = 1; i <= 3; i++) {
        spawnTimes.push(i * 100);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([[], [], spawnTimes])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([
        new TilePoint(20, 2), new TilePoint(2, 2), new TilePoint(2, 20), new TilePoint(20, 20), new TilePoint(38, 20), new TilePoint(38, 38), new TilePoint(20, 38)
    ])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradJ], 12))
        .withBlackPoints(blackPoints)
        .withEnemySpawnPoint(new TilePoint(20, 1))
        .build();
    return level;
}
function getNineSquareLevel2() {
    var blackPoints = [];
    for (var outerI = 0; outerI < 3; outerI++) {
        for (var outerJ = 0; outerJ < 3; outerJ++) {
            var xTopLeft = 2 + 13 * outerI;
            var yTopLeft = 2 + 13 * outerJ;
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    if (Math.max(i, j) == 9 || Math.min(i, j) == 0) {
                        blackPoints.push(new TilePoint(xTopLeft + i, yTopLeft + j));
                    }
                }
            }
        }
    }
    var spawnTimes = [];
    for (var i = 1; i <= 10; i++) {
        spawnTimes.push(i * 100);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([[], spawnTimes, []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([
        new TilePoint(1, 1), new TilePoint(1, 12), new TilePoint(1, 27), new TilePoint(1, 38),
        new TilePoint(12, 38), new TilePoint(12, 27), new TilePoint(12, 12), new TilePoint(12, 1),
        new TilePoint(27, 1), new TilePoint(27, 12), new TilePoint(27, 27), new TilePoint(27, 38),
        new TilePoint(38, 38), new TilePoint(38, 27), new TilePoint(38, 12), new TilePoint(38, 1)
    ])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradT], 12))
        .withBlackPoints(blackPoints)
        .build();
    return level;
}
function getPowerButtonLevel() {
    var blackPoints = [];
    for (var i = 0; i < 40; i++) {
        for (var j = 0; j < 40; j++) {
            var radiusSquared = (i - 20) * (i - 20) + (j - 20) * (j - 20);
            if (radiusSquared >= 90 && radiusSquared <= 110 && !(Math.abs(i - 20) < 4 && j < 20)) {
                blackPoints.push(new TilePoint(i, j));
            }
        }
    }
    var spawnTimes = [];
    for (var i = 1; i <= 16; i++) {
        spawnTimes.push(i * 100);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([[], [], spawnTimes])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([
        new TilePoint(19, 3), new TilePoint(36, 3), new TilePoint(36, 19), new TilePoint(36, 36),
        new TilePoint(19, 36), new TilePoint(3, 36), new TilePoint(3, 19), new TilePoint(3, 3)
    ])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradT, tetradZ, tetradL], 40))
        .withBlackPoints(blackPoints)
        .withEnemySpawnPoint(new TilePoint(20, 0))
        .build();
    return level;
}
function getQuadCupLevel() {
    var blackPoints = [];
    for (var outerI = 0; outerI < 2; outerI++) {
        for (var outerJ = 0; outerJ < 2; outerJ++) {
            var xTopLeft = 4 + 18 * outerI;
            var yTopLeft = 4 + 18 * outerJ;
            for (var i = 0; i < 14; i++) {
                for (var j = 0; j < 14; j++) {
                    if (((j == 0 && outerJ == 0) || (j == 13 && outerJ == 1)) || i == 0 || i == 13) {
                        blackPoints.push(new TilePoint(xTopLeft + i, yTopLeft + j));
                    }
                }
            }
        }
    }
    var spawnTimes = [];
    for (var i = 1; i <= 7; i++) {
        spawnTimes.push(i * 35);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([[], [], spawnTimes])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([
        new TilePoint(3, 1), new TilePoint(15, 15), new TilePoint(24, 15), new TilePoint(15, 24), new TilePoint(24, 24), new TilePoint(1, 3)
    ])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradZ, tetradS], 40))
        .withBlackPoints(blackPoints)
        .build();
    return level;
}
function getPowerButtonLevel2() {
    var blackPoints = [];
    for (var i = 0; i < 40; i++) {
        for (var j = 0; j < 40; j++) {
            var radiusSquared = (i - 20) * (i - 20) + (j - 20) * (j - 20);
            if (radiusSquared >= 210 && radiusSquared <= 240 && !(Math.abs(i - 20) < 4 && j > 20)) {
                blackPoints.push(new TilePoint(i, j));
            }
        }
    }
    var spawnTimes = [];
    for (var i = 1; i <= 15; i++) {
        spawnTimes.push(i * 80);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([[], [], spawnTimes])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([
        new TilePoint(13, 13), new TilePoint(27, 13), new TilePoint(27, 27), new TilePoint(13, 27)
    ])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradI], 28))
        .withBlackPoints(blackPoints)
        .withEnemySpawnPoint(new TilePoint(20, 20))
        .build();
    return level;
}
function getJawsLevel() {
    var blackPoints = [];
    for (var outerY = 0; outerY < 2; outerY++) {
        var y;
        for (var x = 0; x < 40; x++) {
            if (outerY == 0) {
                y = 18;
            }
            else {
                y = 21;
            }
            if (outerY == 0 && x % 10 >= 2 || outerY == 1 && x % 10 <= 3 || x % 10 >= 6) {
                blackPoints.push(new TilePoint(x, y));
            }
            if ((outerY == 0 && (x % 10 == 2 || x % 10 == 9)) || (outerY == 1 && (x % 10 == 3 || x % 10 == 6))) {
                for (y = outerY == 0 ? 18 : 21; y >= 0 && y <= 40; y = outerY == 0 ? y - 1 : y + 1) {
                    blackPoints.push(new TilePoint(x, y));
                }
            }
        }
    }
    var spawnTimes = [];
    for (var i = 1; i <= 15; i++) {
        spawnTimes.push(i * 60);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([[], spawnTimes, []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([
        new TilePoint(1, 0), new TilePoint(5, 39),
        new TilePoint(11, 0), new TilePoint(15, 39),
        new TilePoint(21, 0), new TilePoint(25, 39),
        new TilePoint(31, 0), new TilePoint(35, 39)
    ])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradO], 20))
        .withBlackPoints(blackPoints)
        .build();
    return level;
}
function getDeathStarLevel() {
    var blackPoints = [];
    for (var i = 0; i < 40; i++) {
        for (var j = 0; j < 40; j++) {
            var radiusSquared = (i - 20) * (i - 20) + (j - 20) * (j - 20);
            if (radiusSquared >= 210 && radiusSquared <= 240 && !(Math.abs(i - 20) < 4)) {
                blackPoints.push(new TilePoint(i, j));
            }
            if (radiusSquared >= 90 && radiusSquared <= 110 && !(Math.abs(j - 20) < 4)) {
                blackPoints.push(new TilePoint(i, j));
            }
        }
    }
    var spawnTimes = [];
    for (var i = 1; i <= 15; i++) {
        spawnTimes.push(i * 80);
    }
    var level = new LevelBuilder()
        .withEnemySpawnTimes([[], [], spawnTimes])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([
        new TilePoint(1, 1), new TilePoint(18, 18), new TilePoint(21, 18), new TilePoint(39, 1),
        new TilePoint(39, 39), new TilePoint(21, 21), new TilePoint(18, 21), new TilePoint(1, 39)
    ])
        .withCanvas(canvas)
        .withTetradList(repeatList([tetradL, tetradJ], 28))
        .withBlackPoints(blackPoints)
        .build();
    return level;
}
function repeatList(typeList, numTetrads) {
    var result = [];
    for (var i = 0; i < numTetrads; i++) {
        result.push(typeList[i % typeList.length]);
    }
    return result;
}
