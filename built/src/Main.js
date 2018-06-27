import { TilePoint } from "./TilePoint.js";
import { Util } from "./Util.js";
import { Controller } from "./Controller.js";
import { tetradO, TetradType, tetradJ, tetradL } from "./TetradType.js";
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
    var spawnTimes = [];
    for (var i = 1; i <= 12; i++) {
        spawnTimes.push(i * 800);
    }
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([spawnTimes, [], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1), new TilePoint(39, 39), new TilePoint(1, 39)])
        .withCanvas(canvas)
        .withTetradFactory(TetradType.getRandomTetrad)
        .withBlackPoints([])
        .build();
    return level;
}
function getLevelTwo() {
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([[800, 1600, 2400], [3200, 4000, 4800, 5600, 6400, 7200, 8000, 8800, 9600], []])
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
    var aSpawnTimes = [];
    for (var i = 1; i <= 12; i++) {
        aSpawnTimes.push(i * 800);
    }
    var blockedPoints = [];
    for (var i = 1; i < 20; i++) {
        for (var j = 1; j < 20; j++) {
            blockedPoints.push(new TilePoint(2 * i, 2 * j));
        }
    }
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([aSpawnTimes, [10000, 11000, 12000, 13000, 14000], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1), new TilePoint(1, 39), new TilePoint(39, 39)])
        .withCanvas(canvas)
        .withTetradFactory(getListBasedTetradTypeFactory([tetradL, tetradJ]))
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
