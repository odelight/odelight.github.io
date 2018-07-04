import { TilePoint } from "./TilePoint.js";
import { Util } from "./Util.js";
import { Controller } from "./Controller.js";
import { tetradO, tetradI, TetradType, tetradS, tetradJ, tetradL, tetradT } from "./TetradType.js";
import { LevelBuilder } from "./LevelBuilder.js";
var canvas = Util.checkType(document.getElementById("gameCanvas"), HTMLCanvasElement);
var levelLoaders = [];
var currentLevelIndex;
var controller;
var lossAlerted = false;
var audio = [new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/2a15a8a2/resources/Journey.mp3'), new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/3c14b21e/resources/Dixie.mp3')];
var victorySound = new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/156fbc20/resources/Victory.mp3');
var audioPlaying = false;
var waitingForClickToContinue = false;
var currentLevel;
start();
function start() {
    levelLoaders[0] = getLevelOne;
    levelLoaders[1] = getLevelTwo;
    levelLoaders[2] = getLevelThree;
    levelLoaders[3] = getLevelFour;
    levelLoaders[4] = getLevelFive;
    levelLoaders[5] = getLevelSix;
    levelLoaders[6] = getLevelSeven;
    levelLoaders[7] = getLevelEight;
    levelLoaders[8] = getLevelNine;
    levelLoaders[9] = getLevelTen;
    controller = new Controller(document);
    loadLevel(0);
    //loadLevel(9);
    setIntermediateScreen("Press anywhere to start the game", currentLevel.view);
    var updateVar = setInterval(updateLevel, 10);
}
function loadLevel(levelIndex) {
    playMusicForLevel(levelIndex);
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
        if (currentLevel.wonGame) {
            if (isLastLevel(currentLevelIndex)) {
                setIntermediateScreen("You beat the last level! Click anywhere to restart", currentLevel.view);
                currentLevelIndex = 0;
                playVictorySound();
            }
            else {
                setIntermediateScreen("You beat level " + currentLevelIndex + ". Click anywhere to load the next level", currentLevel.view);
                currentLevelIndex++;
                playVictorySound();
            }
        }
        else {
            setIntermediateScreen("You lost on level " + currentLevelIndex + ". Click anywhere to retry the level", currentLevel.view);
        }
    }
}
function setIntermediateScreen(text, view) {
    view.intermediateScreen(text);
    controller.setWaitForClick();
    waitingForClickToContinue = true;
}
function isLastLevel(level) {
    return level >= levelLoaders.length - 1;
}
function playVictorySound() {
    stopMusic();
    victorySound.play();
}
function playMusicForLevel(levelIndex) {
    if (!audioPlaying) {
        if (levelIndex < 5) {
            playMusic(audio[0]);
        }
        else {
            playMusic(audio[1]);
        }
    }
}
function stopMusic() {
    for (var i = 0; i < audio.length; i++) {
        audio[i].pause();
    }
    audioPlaying = false;
}
function playMusic(audio) {
    audio.loop = true;
    var playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => audioPlaying = true).catch(() => {
            setTimeout(() => playMusic(audio), 100);
        });
    }
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
        .withTetradFactory(TetradType.getRandomTetrad)
        .withBlackPoints([])
        .build();
    return level;
}
function getLevelTwo() {
    var level = new LevelBuilder()
        .withLives(2)
        .withEnemySpawnTimes([[800, 1600, 2400], [3200, 4000, 4800], []])
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
    for (var i = 1; i <= 30; i++) {
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
function getLevelFour() {
    var level = new LevelBuilder()
        .withLives(2)
        .withEnemySpawnTimes([[500, 1000, 1500], [2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000], []])
        .withBoardWidth(40)
        .withBoardHeight(40)
        .withWayPoints([new TilePoint(1, 1), new TilePoint(39, 39), new TilePoint(1, 39), new TilePoint(39, 1)])
        .withCanvas(canvas)
        .withTetradFactory(getListBasedTetradTypeFactory([tetradL, tetradJ]))
        .withBlackPoints([])
        .build();
    return level;
}
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
    var spawnTimes = [];
    for (var i = 1; i <= 35; i++) {
        spawnTimes.push(1000 + i * 350);
    }
    var blackPoints = [];
    for (var i = 0; i <= 31; i++) {
        blackPoints.push(new TilePoint(4 + i, 10));
        blackPoints.push(new TilePoint(4 + i, 20));
        blackPoints.push(new TilePoint(4 + i, 30));
    }
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([spawnTimes, [], []])
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
    var spawnTimes = [];
    for (var i = 1; i <= 30; i++) {
        spawnTimes.push(1000 + i * 350);
    }
    var blackPoints = [];
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 20; j++)
            blackPoints.push(new TilePoint(3 + 7 * i, 2 * j + 1));
    }
    var level = new LevelBuilder()
        .withLives(5)
        .withEnemySpawnTimes([spawnTimes, [], []])
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
