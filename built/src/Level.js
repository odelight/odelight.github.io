import { TilePoint } from "./TilePoint.js";
import { Tetrad } from "./Tetrad.js";
import { MapGrid } from "./MapGrid.js";
import { View } from "./View.js";
import { Util } from "./Util.js";
import { Pathing } from "./Pathing.js";
import { TetradType } from "./TetradType.js";
import { Enemy } from "./Enemy.js";
import { Attack } from "./Attack.js";
import { Combo } from "./Combo.js";
import { PathingObject } from "./PathingObject.js";
import { EnemyTypes } from "./EnemyType.js";
import { AudioService } from "./AudioService.js";
export class Level {
    constructor(lives, enemySpawnTimes, boardHeight, boardWidth, wayPoints, canvas, placeableTetradList, blackPoints, enemySpawnPoint) {
        this.enemiesRunning = false;
        this.tetradPlacementLegal = true;
        this.isOver = false;
        this.wonGame = false;
        this.tetradList = [];
        this.comingTetrads = [];
        this.ghostTetrad = null;
        this.enemyList = [];
        this.attackList = [];
        this.lives = lives;
        this.enemySpawnTimes = enemySpawnTimes;
        this.boardHeight = boardHeight;
        this.boardWidth = boardWidth;
        this.tileHeight = 20;
        this.tileWidth = 20;
        this.wayPoints = wayPoints;
        this.displayRegionWidth = 9 * this.tileWidth;
        canvas.width = boardWidth * this.tileWidth + this.displayRegionWidth;
        canvas.height = boardHeight * this.tileHeight;
        this.context = Util.checkType(canvas.getContext("2d"), CanvasRenderingContext2D);
        this.time = 0;
        this.remainingEnemies = 0;
        for (var i = 0; i < enemySpawnTimes.length; i++) {
            this.remainingEnemies += enemySpawnTimes[i].length;
        }
        this.mapGrid = new MapGrid(boardWidth, boardHeight);
        this.blackPoints = blackPoints;
        for (var i = 0; i < blackPoints.length; i++) {
            this.mapGrid.setBlocked(blackPoints[i]);
        }
        this.view = new View(this.context, boardWidth, boardHeight, this.tileWidth, this.tileHeight, this.displayRegionWidth);
        this.pathers = [];
        for (var i = 0; i < wayPoints.length; i++) {
            this.pathers[i] = new Pathing();
        }
        this.updatePatherMapGrid();
        this.enemySpawnPoint = enemySpawnPoint;
        this.fullPath = Pathing.fullPath(this.pathers, this.enemySpawnPoint);
        this.placeableTetradList = placeableTetradList;
        var firstTetrad = this.getNextTetrad();
        if (firstTetrad != null) {
            this.nextTetrad = firstTetrad;
        }
        for (var i = 0; i < 12; i++) {
            var nextTetrad = this.getNextTetrad();
            if (nextTetrad != null) {
                this.comingTetrads.push(nextTetrad);
            }
        }
    }
    advanceComingTetrads() {
        var comingTetrad = this.comingTetrads.shift();
        if (comingTetrad == null) {
            this.nextTetrad = null;
            return false;
        }
        this.nextTetrad = comingTetrad;
        var nextTetrad = this.getNextTetrad();
        if (nextTetrad != null) {
            this.comingTetrads.push(nextTetrad);
        }
        return true;
    }
    getNextTetrad() {
        var result = this.placeableTetradList.shift();
        if (result !== undefined) {
            return result;
        }
        else {
            return null;
        }
    }
    updateGhostTetrad(rawMouseX, rawMouseY) {
        if (this.nextTetrad == null) {
            this.ghostTetrad = null;
            return;
        }
        var drawPos = this.getDrawPositionFromMouse(rawMouseX, rawMouseY, this.nextTetrad);
        this.clearAndDrawStatic();
        this.ghostTetrad = new Tetrad(this.nextTetrad, drawPos.x, drawPos.y);
        this.tetradPlacementLegal = this.cheapCanPlaceLegally(this.nextTetrad, drawPos.x, drawPos.y);
    }
    startSpawningEnemies() {
        this.enemiesRunning = true;
    }
    tryPlaceTetrad(x, y) {
        if (this.nextTetrad == null) {
            return;
        }
        var drawPos = this.getDrawPositionFromMouse(x, y, this.nextTetrad);
        if (this.nextTetrad != null && this.canPlaceLegally(this.nextTetrad, drawPos.x, drawPos.y)) {
            this.pushTetrad(new Tetrad(this.nextTetrad, drawPos.x, drawPos.y));
            if (!this.advanceComingTetrads()) {
                this.startSpawningEnemies();
            }
        }
        else {
            AudioService.playErrorSound();
        }
    }
    tryRotateTetrad(rawMouseX, rawMouseY) {
        if (this.nextTetrad == null) {
            return;
        }
        this.nextTetrad = TetradType.rotateTetrad(this.nextTetrad);
        this.updateGhostTetrad(rawMouseX, rawMouseY);
    }
    getDrawPositionFromMouse(mouseX, mouseY, tetrad) {
        var drawX = Math.floor((mouseX / this.tileWidth) - tetrad.centerX - 0.2);
        var drawY = Math.floor((mouseY / this.tileHeight) - tetrad.centerY - 0.2);
        return new TilePoint(drawX, drawY);
    }
    clearAndDrawStatic() {
        //clear canvas;
        this.view.clear();
        for (var i = 0; i < this.tetradList.length; i++) {
            var tetrad = this.tetradList[i];
            this.view.drawTetrad(tetrad.type, tetrad.position.x, tetrad.position.y, false);
        }
        this.view.drawEnemies(this.enemyList);
        this.view.drawAttacks(this.attackList);
        if (this.ghostTetrad != null) {
            this.view.drawTetrad(this.ghostTetrad.type, this.ghostTetrad.position.x, this.ghostTetrad.position.y, true, this.tetradPlacementLegal);
        }
        var livesXCenter = this.boardWidth * this.tileWidth + (this.displayRegionWidth / 2);
        this.view.drawLives(this.lives, 20, livesXCenter, this.displayRegionWidth / 4);
        var moreTetradsX = this.boardWidth * this.tileWidth + (this.displayRegionWidth / 8);
        var moreTetradsY = this.boardHeight * this.tileHeight - this.displayRegionWidth / 4;
        if (this.placeableTetradList.length > 0) {
            this.view.drawTetradsToPlace(this.placeableTetradList.length, 20, moreTetradsX, moreTetradsY);
        }
        this.view.drawUpcomingTetrads(this.comingTetrads);
        this.view.drawBlockedSpaces(this.blackPoints);
        this.view.drawPath(this.fullPath, this.wayPoints);
    }
    cheapCanPlaceLegally(T, xPosition, yPosition) {
        for (var i = 0; i < T.offsetList.length; i++) {
            var xCoord = xPosition + T.offsetList[i].x;
            var yCoord = yPosition + T.offsetList[i].y;
            var tilePoint = new TilePoint(xCoord, yCoord);
            if (xCoord < 0 || xCoord >= this.boardWidth || yCoord < 0 || yCoord >= this.boardHeight) {
                return false;
            }
            if (this.mapGrid.isBlocked(tilePoint)) {
                return false;
            }
            for (var j = 0; j < this.wayPoints.length; j++) {
                if (this.wayPoints[j].equals(tilePoint)) {
                    return false;
                }
            }
        }
        return true;
    }
    canPlaceLegally(T, xPosition, yPosition) {
        if (!this.cheapCanPlaceLegally(T, xPosition, yPosition)) {
            return false;
        }
        var tetrad = new Tetrad(T, xPosition, yPosition);
        var checkPathers = [];
        for (var i = 0; i < this.wayPoints.length; i++) {
            checkPathers[i] = new Pathing();
            checkPathers[i].resetMap(this.mapGrid, this.wayPoints[i], tetrad);
        }
        if (Pathing.fullPath(checkPathers, this.enemySpawnPoint) == null) {
            return false;
        }
        return true;
    }
    pushTetrad(T) {
        var toPush = Combo.detectCombos(T, this.tetradList);
        if (toPush != null) {
            AudioService.playEliteTetradSound();
        }
        else {
            AudioService.playBuildTetradSound();
        }
        this.tetradList.push(T);
        if (toPush != null) {
            var bigTetrad = toPush.bigTetrad;
            var components = toPush.components;
            for (var i = 0; i < components.length; i++) {
                this.tetradList.splice(this.tetradList.indexOf(components[i]), 1);
            }
            this.tetradList.push(bigTetrad);
        }
        for (var i = 0; i < T.type.blockedList.length; i++) {
            this.mapGrid.setBlocked(T.type.blockedList[i].offset(T.position));
        }
        this.updatePatherMapGrid();
        for (var i = 0; i < this.enemyList.length; i++) {
            this.enemyList[i].pathing.setPathers(this.pathers);
        }
        this.fullPath = Pathing.fullPath(this.pathers, this.enemySpawnPoint);
    }
    updatePatherMapGrid() {
        for (var i = 0; i < this.wayPoints.length; i++) {
            this.pathers[i].resetMap(this.mapGrid, this.wayPoints[i], null);
        }
    }
    update() {
        if (this.enemiesRunning) {
            this.spawnEnemies();
            this.doAttacks();
            this.updateEnemies();
            this.time++;
        }
        this.clearAndDrawStatic();
    }
    updateEnemies() {
        for (var i = 0; i < this.enemyList.length; i++) {
            var enemy = this.enemyList[i];
            var enemyPathing = enemy.pathing;
            if (enemyPathing.update(enemy.currentSpeed)) {
                this.decrementLives();
                this.destroyEnemy(enemy);
                continue;
            }
            enemy.updateEffectTimers();
        }
    }
    decrementLives() {
        this.lives = this.lives - 1;
        if (this.lives <= 0) {
            this.lose();
        }
    }
    doAttacks() {
        for (var i = 0; i < this.tetradList.length; i++) {
            var tetrad = this.tetradList[i];
            if (tetrad.type.attackType.slows()) {
                if (this.tetradDoAttack(tetrad, (enemy) => !enemy.isSlowed())) {
                    continue;
                }
            }
            this.tetradDoAttack(tetrad);
        }
    }
    tetradDoAttack(tetrad, predicate = null) {
        var multiTarget = tetrad.type.attackType.multiTarget;
        var result = false;
        if (this.time % tetrad.type.attackType.attackDelay == 0) {
            for (var j = 0; j < this.enemyList.length; j++) {
                var enemy = this.enemyList[j];
                var enemyTilePosition = enemy.pathing.pixelPosition.asTilePoint(this.tileWidth, this.tileHeight);
                if (Pathing.straightDistance(tetrad.position, enemyTilePosition) < tetrad.type.attackType.range) {
                    if (predicate == null || predicate(enemy)) {
                        this.doAttack(tetrad, enemy);
                        if (!multiTarget) {
                            return true;
                        }
                        else {
                            result = true;
                        }
                    }
                }
            }
            if (predicate != null) {
                return this.tetradDoAttack(tetrad);
            }
        }
        return result;
    }
    doAttack(tetrad, enemy) {
        tetrad.type.attackType.apply(enemy);
        if (enemy.hp <= 0) {
            this.destroyEnemy(enemy);
        }
        this.attackList.push(new Attack(tetrad, enemy.pathing.pixelPosition));
    }
    destroyEnemy(enemy) {
        this.enemyList.splice(this.enemyList.indexOf(enemy), 1);
        this.remainingEnemies = this.remainingEnemies - 1;
        if (this.remainingEnemies <= 0) {
            this.win();
        }
    }
    spawnEnemies() {
        for (var i = 0; i < EnemyTypes.length; i++) {
            if (this.time >= this.enemySpawnTimes[i][0]) {
                this.enemyList.push(this.getEnemy(i));
                this.enemySpawnTimes[i].shift();
            }
        }
    }
    getEnemy(enemyTypeIndex) {
        return new Enemy(EnemyTypes[enemyTypeIndex], new PathingObject(this.wayPoints.slice(0), this.enemySpawnPoint, this.pathers, this.tileWidth, this.tileHeight));
    }
    lose() {
        this.wonGame = false;
        this.isOver = true;
    }
    win() {
        this.wonGame = true;
        this.isOver = true;
    }
}
