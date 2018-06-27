import { TilePoint } from "./TilePoint.js";
import { Util } from "./Util.js";
import { Controller } from "./Controller.js";
import { tetradO, tetradS, tetradZ, tetradJ, tetradL } from "./TetradType.js";
import { LevelBuilder } from "./LevelBuilder.js";
var canvas = Util.checkType(document.getElementById("gameCanvas"), HTMLCanvasElement);
var levels = [];
var currentLevelIndex;
var controller;
var lossAlerted = false;
start();
function start() {
    levels[0] = getLevelOne();
    levels[1] = getLevelTwo();
    levels[2] = getLevelThree();
    levels[3] = getLevelFour();
    controller = new Controller(document);
    loadLevel(0);
    var updateVar = setInterval(updateLevel, 10);
}
function loadLevel(levelIndex) {
    controller.setLevel(levels[levelIndex]);
    currentLevelIndex = levelIndex;
}
function updateLevel() {
    levels[currentLevelIndex].update();
    if (levels[currentLevelIndex].isOver) {
        if (levels[currentLevelIndex].wonGame) {
            loadNextLevel();
        }
        else {
            if (!lossAlerted) {
                alert("You lost. Sorry :(");
                lossAlerted = true;
            }
        }
    }
}
function loadNextLevel() {
    if (currentLevelIndex < levels.length - 1) {
        currentLevelIndex++;
    }
    loadLevel(currentLevelIndex);
}
function getLevelOne() {
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([[200], [], []]) //([[800, 1600, 2400, 3200, 4000],[],[]])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 39)])
        .withCanvas(canvas)
        .withTetradFactory(() => tetradO)
        .withBlackPoints([])
        .build();
    return level;
}
function getLevelTwo() {
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([[800, 1600, 2400], [3200, 4000, 4800, 5600, 6400, 7200, 8000], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1), new TilePoint(1, 39), new TilePoint(39, 39)])
        .withCanvas(canvas)
        .withTetradFactory(() => tetradO)
        .withBlackPoints([])
        .build();
    return level;
}
function getLevelThree() {
    var blockedPoints = [];
    for (var i = 0; i <= 20; i++) {
        for (var j = 0; j <= 20; j++) {
            blockedPoints.push(new TilePoint(2 * i, 2 * j));
        }
    }
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([[800, 1600, 2400], [3200, 4000, 4800, 5600, 6400, 7200, 8000], []])
        .withBoardWidth(41)
        .withBoardHeight(41)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1), new TilePoint(1, 39), new TilePoint(39, 39)])
        .withCanvas(canvas)
        .withTetradFactory(getListBasedTetradTypeFactory([tetradL, tetradJ]))
        .withBlackPoints(blockedPoints)
        .build();
    return level;
}
function getLevelFour() {
    var blockedPoints = [];
    for (var i = 1; i <= 12; i++) {
        for (var j = 1; j <= 12; j++) {
            blockedPoints.push(new TilePoint(3 * i, 3 * j));
        }
    }
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([[800, 1600, 2400], [3200, 4000, 4800, 5600, 6400, 7200, 8000], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1), new TilePoint(1, 39), new TilePoint(39, 39)])
        .withCanvas(canvas)
        .withTetradFactory(getListBasedTetradTypeFactory([tetradS, tetradZ]))
        .withBlackPoints(blockedPoints)
        .build();
    return level;
}
function getListBasedTetradTypeFactory(typeList) {
    var i = 0;
    return () => {
        return typeList[i++ % typeList.length];
    };
}
