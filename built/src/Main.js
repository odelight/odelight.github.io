import { TilePoint } from "./TilePoint.js";
import { Util } from "./Util.js";
import { Controller } from "./Controller.js";
import { tetradO, tetradI, tetradS, tetradZ, tetradJ, tetradL, tetradT } from "./TetradType.js";
import { LevelBuilder } from "./LevelBuilder.js";
import { AudioService } from "./AudioService.js";
var canvas = Util.checkType(document.getElementById("gameCanvas"), HTMLCanvasElement);
var levelLoaders = [];
var currentLevelIndex;
var controller;
var lossAlerted = false;
var waitingForClickToContinue = false;
var currentLevel;
start();
function start() {
    var i = 0;
    levelLoaders[i++] = getLevelOne;
    levelLoaders[i++] = getLevelTwo;
    levelLoaders[i++] = getLevelThree;
    //	levelLoaders[3] = getLevelFour;
    levelLoaders[i++] = getLevelFive;
    levelLoaders[i++] = getLevelSix;
    levelLoaders[i++] = getLevelSeven;
    levelLoaders[i++] = getLevelEight;
    levelLoaders[i++] = getLevelNine;
    levelLoaders[i++] = getLevelTen;
    controller = new Controller(document);
    var startLevel = getStartLevel();
    loadLevel(startLevel);
    setIntermediateScreen("Press anywhere to start the game", currentLevel.view);
    populateLevelSelector(document, levelLoaders);
    var updateVar = setInterval(updateLevel, 10);
}
function getStartLevel() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var startLevelString = url.searchParams.get("startLevel");
    if (startLevelString == null) {
        return 0;
    }
    var startLevel = parseInt(startLevelString) - 1;
    if (startLevel < 0 || startLevel >= levelLoaders.length || !Number.isInteger(startLevel)) {
        return 0;
    }
    return startLevel;
}
function loadLevel(levelIndex) {
    AudioService.playMusicForLevel(levelIndex);
    currentLevel = levelLoaders[levelIndex]();
    currentLevelIndex = levelIndex;
    controller.setLevel(currentLevel);
}
function updateLevel() {
    if (waitingForClickToContinue) {
        if (!controller.isWaitingForClick()) {
            waitingForClickToContinue = false;
            loadLevel(currentLevelIndex);
        }
        else {
            return;
        }
    }
    currentLevel.update();
    if (currentLevel.isOver) {
        handleLevelOver();
    }
}
function handleLevelOver() {
    if (currentLevel.wonGame) {
        if (isLastLevel(currentLevelIndex)) {
            setIntermediateScreen("You beat the last level! Click anywhere to restart", currentLevel.view);
            currentLevelIndex = 0;
            AudioService.playVictorySound();
        }
        else {
            setIntermediateScreen("You beat level " + makeLevelUserDisplayable(currentLevelIndex) + ". Click anywhere to load the next level", currentLevel.view);
            currentLevelIndex++;
            AudioService.playVictorySound();
        }
    }
    else {
        setIntermediateScreen("You lost on level " + makeLevelUserDisplayable(currentLevelIndex) + ". Click anywhere to retry the level", currentLevel.view);
        AudioService.playDefeatSound();
    }
}
function makeLevelUserDisplayable(levelIndex) {
    return levelIndex + 1;
}
function setIntermediateScreen(text, view) {
    view.intermediateScreen(text);
    controller.setWaitForClick();
    waitingForClickToContinue = true;
}
function isLastLevel(level) {
    return level >= levelLoaders.length - 1;
}
function populateLevelSelector(document, levelLoaders) {
    var levelSelector = Util.checkType(document.getElementById('levels'), HTMLSelectElement);
    for (var i = 0; i < levelLoaders.length; i++) {
        var option = document.createElement("option");
        option.text = "" + makeLevelUserDisplayable(i);
        option.value = "" + i;
        levelSelector.add(option);
    }
    levelSelector.onchange = (ev) => {
        loadLevel(parseInt(levelSelector.options[levelSelector.selectedIndex].value));
        setIntermediateScreen("Press anywhere to start the level", currentLevel.view);
    };
}
function getLevelOne() {
    var spawnTimes = [];
    for (var i = 1; i <= 3; i++) {
        spawnTimes.push(i * 1300);
    }
    var level = new LevelBuilder()
        .withLives(2)
        .withEnemySpawnTimes([spawnTimes, [], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1), new TilePoint(39, 39), new TilePoint(1, 39)])
        .withCanvas(canvas)
        .withTetradFactory(getListBasedTetradTypeFactory([tetradS, tetradT, tetradJ, tetradO, tetradI, tetradZ, tetradL]))
        .withBlackPoints([])
        .build();
    return level;
}
function getLevelTwo() {
    var level = new LevelBuilder()
        .withLives(2)
        .withEnemySpawnTimes([[800, 1600, 2400], [3200, 3800, 4400, 5000], []])
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
    var spawnTimes = [];
    for (var i = 1; i <= 28; i++) {
        spawnTimes.push(i * (350 - 7 * i));
    }
    var level = new LevelBuilder()
        .withLives(2)
        .withEnemySpawnTimes([spawnTimes, [], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(1, 39), new TilePoint(39, 39), new TilePoint(39, 1), new TilePoint(2, 1)])
        .withCanvas(canvas)
        .withTetradFactory(() => tetradS)
        .withBlackPoints([])
        .build();
    return level;
}
/*
function getLevelFour() : Level {
    var level : Level = new LevelBuilder()
    .withLives(2)
    .withEnemySpawnTimes([[500, 1000, 1500],[2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000], []])
    .withBoardWidth(40)
    .withBoardHeight(40)
    .withWayPoints([new TilePoint(1,1), new TilePoint(39,39), new TilePoint(1,39), new TilePoint(39,1)])
    .withCanvas(canvas)
    .withTetradFactory(getListBasedTetradTypeFactory([tetradL, tetradJ]))
    .withBlackPoints([])
    .build();
    return level;
}
*/
function getLevelFive() {
    var bSpawnTimes = [];
    for (var i = 1; i <= 30; i++) {
        bSpawnTimes.push(i * 250);
    }
    var level = new LevelBuilder()
        .withLives(2)
        .withEnemySpawnTimes([[], bSpawnTimes, []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(1, 30), new TilePoint(30, 30), new TilePoint(30, 10), new TilePoint(10, 10), new TilePoint(10, 39), new TilePoint(39, 39)])
        .withCanvas(canvas)
        .withTetradFactory(() => tetradS)
        .withBlackPoints([])
        .build();
    return level;
}
function getLevelSix() {
    var spawnTimes = [];
    for (var i = 1; i <= 30; i++) {
        spawnTimes.push(1000 + i * (500 - 15 * i));
    }
    var blackPoints = [];
    for (var i = 0; i <= 20; i++) {
        blackPoints.push(new TilePoint(10, 10 + i));
        blackPoints.push(new TilePoint(10 + i, 30));
        blackPoints.push(new TilePoint(30, 30 - i));
    }
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([spawnTimes, [], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1)])
        .withCanvas(canvas)
        .withTetradFactory(() => tetradI)
        .withBlackPoints(blackPoints)
        .build();
    return level;
}
function getLevelSeven() {
    var aSpawnTimes = [];
    var bSpawnTimes = [];
    for (var i = 1; i <= 24; i++) {
        aSpawnTimes.push(1000 + i * (350 - 4 * i));
        if (i > 10) {
            bSpawnTimes.push(1000 + i * (350 - 4 * i));
        }
    }
    var blackPoints = [];
    for (var i = 0; i <= 31; i++) {
        blackPoints.push(new TilePoint(4 + i, 10));
        blackPoints.push(new TilePoint(4 + i, 20));
        blackPoints.push(new TilePoint(4 + i, 30));
    }
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([aSpawnTimes, bSpawnTimes, []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(20, 1), new TilePoint(20, 39)])
        .withCanvas(canvas)
        .withTetradFactory(() => tetradO)
        .withBlackPoints(blackPoints)
        .withEnemySpawnPoint(new TilePoint(20, 0))
        .build();
    return level;
}
function getLevelEight() {
    var spawnTimes = [];
    for (var i = 1; i <= 40; i++) {
        spawnTimes.push(1000 + i * (300 - 4 * i));
    }
    var blackPoints = [];
    for (var i = 0; i <= 23; i++) {
        blackPoints.push(new TilePoint(8 + i, 8));
        blackPoints.push(new TilePoint(8 + i, 31));
        blackPoints.push(new TilePoint(8, 8 + i));
        blackPoints.push(new TilePoint(31, 8 + i));
    }
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([spawnTimes, [], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(1, 39), new TilePoint(39, 39), new TilePoint(39, 1), new TilePoint(2, 1)])
        .withCanvas(canvas)
        .withTetradFactory(() => tetradS)
        .withBlackPoints(blackPoints)
        .build();
    return level;
}
function getLevelNine() {
    var aSpawnTimes = [];
    var bSpawnTimes = [];
    for (var i = 1; i <= 30; i++) {
        aSpawnTimes.push(1000 + i * 300);
        if (i > 10) {
            bSpawnTimes.push(1000 + i * 350);
        }
    }
    var blackPoints = [];
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 20; j++)
            blackPoints.push(new TilePoint(3 + 7 * i, 2 * j + 1));
    }
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([aSpawnTimes, bSpawnTimes, []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 1), new TilePoint(39, 39), new TilePoint(1, 39), new TilePoint(1, 2)])
        .withCanvas(canvas)
        .withTetradFactory(getListBasedTetradTypeFactory([tetradL, tetradJ]))
        .withBlackPoints(blackPoints)
        .build();
    return level;
}
function getLevelTen() {
    var spawnTimes = [];
    for (var i = 1; i <= 45; i++) {
        spawnTimes.push(2000 + i * (350 - 5 * i));
    }
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([spawnTimes, [], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(19, 1), new TilePoint(11, 9), new TilePoint(29, 27), new TilePoint(20, 36), new TilePoint(11, 27), new TilePoint(29, 9), new TilePoint(21, 1)])
        .withCanvas(canvas)
        .withTetradFactory(() => tetradT)
        .withBlackPoints([])
        .withEnemySpawnPoint(new TilePoint(20, 1))
        .build();
    return level;
}
function getListBasedTetradTypeFactory(typeList) {
    var i = 0;
    return () => {
        return typeList[i++ % typeList.length];
    };
}
