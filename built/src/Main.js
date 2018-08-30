import { Util } from "./Util.js";
import { Controller } from "./Controller.js";
import { AudioService } from "./AudioService.js";
import { populateLevelLoaders } from "./LevelLoaders.js";
var canvas = Util.checkType(document.getElementById("gameCanvas"), HTMLCanvasElement);
var levelLoaders = [];
var currentLevelIndex;
var controller;
var lossAlerted = false;
var currentLevel;
var difficulty = 1;
start();
function start() {
    levelLoaders = populateLevelLoaders();
    controller = new Controller(document);
    var startLevel = getStartLevel();
    loadLevel(startLevel);
    setIntermediateScreen("Press anywhere to start the game", currentLevel.view);
    populateLevelSelector(document, levelLoaders);
    populateDifficultySelector(document);
    setupRestartLevelButton(document);
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
    currentLevel = levelLoaders[levelIndex]();
    currentLevelIndex = levelIndex;
    currentLevel.setLevelNumber(makeLevelUserDisplayable(levelIndex));
    currentLevel.setDifficulty(difficulty);
    controller.setLevel(currentLevel);
}
function updateLevel() {
    if (controller.isWaitingForClick()) {
        return;
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
            updateLevelSelector(document, currentLevelIndex);
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
var hintIndex;
function setIntermediateScreen(text, view) {
    if (hintIndex === undefined) {
        hintIndex = -1;
    }
    view.intermediateScreen(text, hintIndex % 3);
    hintIndex++;
    controller.setWaitForClick();
    controller.registerWaitingForClickListener(() => loadLevel(currentLevelIndex));
    controller.registerWaitingForClickListener(() => AudioService.playMusicForLevel(currentLevelIndex));
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
function populateDifficultySelector(document) {
    var difficultySelector = Util.checkType(document.getElementById('difficulties'), HTMLSelectElement);
    var availableDifficulties = ['Easy', 'Medium', 'Hard'];
    var difficultyHealthMultipliers = [50, 75, 100];
    for (var i = 0; i < availableDifficulties.length; i++) {
        var option = document.createElement("option");
        option.text = availableDifficulties[i];
        option.value = "" + difficultyHealthMultipliers[i];
        difficultySelector.add(option);
    }
    difficultySelector.onchange = (ev) => {
        difficulty = parseInt(difficultySelector.options[difficultySelector.selectedIndex].value) / 100;
        currentLevel.setDifficulty(difficulty);
    };
    difficulty = parseInt(difficultySelector.options[difficultySelector.selectedIndex].value) / 100;
    currentLevel.setDifficulty(difficulty);
}
function updateLevelSelector(document, level) {
    var levelSelector = Util.checkType(document.getElementById('levels'), HTMLSelectElement);
    levelSelector.selectedIndex = level;
}
function setupRestartLevelButton(document) {
    var restartButton = Util.checkType(document.getElementById('restart-button'), HTMLButtonElement);
    restartButton.onclick = (() => loadLevel(currentLevelIndex));
}
