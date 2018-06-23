import { Point } from "./Point.js";
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
export class Level {
    constructor(lives, enemySpawnTimes, boardHeight, boardWidth, wayPoints, canvas, tetradFactory, blackPoints) {
        this.tetradPlacementLegal = true;
        this.isOver = false;
        this.wonGame = false;
        this.tetradList = [];
        this.comingTetrads = [];
        this.ghostTetrad = null;
        this.enemyList = [];
        this.attackList = [];
        this.towerTimer = 0;
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
        this.towerTimer = 0;
        this.towerBuildDelay = 400;
        this.remainingEnemies = 0;
        for (var i = 0; i < enemySpawnTimes.length; i++) {
            this.remainingEnemies += enemySpawnTimes[i].length;
        }
        this.mapGrid = new MapGrid(boardWidth, boardHeight);
        this.view = new View(this.context, boardWidth, boardHeight, this.tileWidth, this.tileHeight, this.displayRegionWidth);
        this.pathers = [];
        for (var i = 0; i < wayPoints.length - 1; i++) {
            this.pathers[i] = new Pathing();
            this.pathers[i].resetMap(this.mapGrid, wayPoints[i + 1], null);
        }
        this.testPath = this.pathers[0].aStar(wayPoints[0]);
        this.fullPath = Pathing.fullPath(this.pathers, wayPoints[0]);
        this.blackPoints = blackPoints;
        for (var i = 0; i < blackPoints.length; i++) {
            this.mapGrid.setBlocked(blackPoints[i]);
        }
        this.tetradFactory = tetradFactory;
        this.nextTetrad = this.getNextTetrad();
        for (var i = 0; i < 12; i++) {
            this.comingTetrads.push(this.getNextTetrad());
        }
    }
    advanceComingTetrads() {
        var comingTetrad = this.comingTetrads.shift();
        if (comingTetrad == null) {
            throw "Unexpectedly null next tetrad";
        }
        this.nextTetrad = comingTetrad;
        this.comingTetrads.push(this.getNextTetrad());
    }
    getNextTetrad() {
        return this.tetradFactory();
    }
    start() {
        this.updateVar = setInterval(Level.staticUpdate(this), 10);
    }
    //workaround for strange behavior with setInterval where it will try to call non-static methods statically
    static staticUpdate(level) {
        level.update();
    }
    updateGhostTetrad(rawMousePos) {
        var drawPos = this.getDrawPositionFromMouse(rawMousePos.x, rawMousePos.y, this.nextTetrad);
        this.clearAndDrawStatic();
        this.ghostTetrad = new Tetrad(this.nextTetrad, drawPos.x, drawPos.y);
        if (this.canPlaceLegally(this.nextTetrad, drawPos.x, drawPos.y)) {
            this.tetradPlacementLegal = true;
        }
        else {
            this.tetradPlacementLegal = false;
        }
    }
    tryPlaceTetrad(x, y) {
        var drawPos = this.getDrawPositionFromMouse(x, y, this.nextTetrad);
        if (this.towerTimer <= 0 && this.expensiveCanPlaceLegally(this.nextTetrad, drawPos.x, drawPos.y)) {
            this.pushTetrad(new Tetrad(this.nextTetrad, drawPos.x, drawPos.y));
            this.towerTimer = this.towerBuildDelay;
            this.advanceComingTetrads();
        }
    }
    tryRotateTetrad(rawMousePos) {
        this.nextTetrad = TetradType.rotateTetrad(this.nextTetrad);
        this.updateGhostTetrad(rawMousePos);
    }
    getDrawPositionFromMouse(mouseX, mouseY, tetrad) {
        var drawX = Math.floor((mouseX / this.tileWidth) - tetrad.centerX - 0.2);
        var drawY = Math.floor((mouseY / this.tileHeight) - tetrad.centerY - 0.2);
        return new Point(drawX, drawY);
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
        var timerXCenter = this.boardWidth * this.tileWidth + (this.displayRegionWidth / 4);
        this.view.drawTimer(this.towerTimer / this.towerBuildDelay, timerXCenter, this.displayRegionWidth / 4, this.displayRegionWidth / 8);
        var livesXCenter = this.boardWidth * this.tileWidth + (this.displayRegionWidth / 2);
        this.view.drawLives(this.lives, 20, livesXCenter, this.displayRegionWidth / 4);
        this.view.drawUpcomingTetrads(this.comingTetrads);
        this.view.drawBlockedSpaces(this.blackPoints);
        this.view.drawPath(this.fullPath);
    }
    canPlaceLegally(T, xPosition, yPosition) {
        for (var i = 0; i < T.offsetList.length; i++) {
            var xCoord = xPosition + T.offsetList[i].xOffset;
            var yCoord = yPosition + T.offsetList[i].yOffset;
            if (xCoord < 0 || xCoord >= this.boardWidth || yCoord < 0 || yCoord >= this.boardHeight) {
                return false;
            }
            if (this.mapGrid.isBlocked(new Point(xCoord, yCoord))) {
                return false;
            }
        }
        return true;
    }
    expensiveCanPlaceLegally(T, xPosition, yPosition) {
        if (!this.canPlaceLegally(T, xPosition, yPosition)) {
            return false;
        }
        var tetrad = new Tetrad(T, xPosition, yPosition);
        var checkPathers = [];
        for (var i = 0; i < this.wayPoints.length - 1; i++) {
            checkPathers[i] = new Pathing();
            checkPathers[i].resetMap(this.mapGrid, this.wayPoints[i + 1], tetrad);
        }
        if (Pathing.fullPath(checkPathers, this.wayPoints[0]) == null) {
            return false;
        }
        return true;
    }
    pushTetrad(T) {
        var toPush = Combo.detectCombos(T, this.tetradList);
        this.tetradList.push(T);
        if (toPush != null) {
            var bigTetrad = toPush.bigTetrad;
            var components = toPush.components;
            for (var i = 0; i < components.length; i++) {
                this.tetradList.splice(this.tetradList.indexOf(components[i]), 1);
            }
            this.tetradList.push(bigTetrad);
        }
        for (var i = 0; i < T.type.offsetList.length; i++) {
            this.mapGrid.setBlocked(T.type.offsetList[i].offset(T.position));
        }
        for (var i = 0; i < this.wayPoints.length - 1; i++) {
            this.pathers[i].resetMap(this.mapGrid, this.wayPoints[i + 1], null);
        }
        for (var i = 0; i < this.enemyList.length; i++) {
            var enemyPathing = this.enemyList[i].pathing;
            var enemyPosition = new Point(Math.floor(enemyPathing.position.x / this.tileWidth), Math.floor(enemyPathing.position.y / this.tileHeight));
            //track = pather.aStar(Math.floor(enemy.position.x / tileWidth), Math.floor(enemy.position.y / tileHeight), goalX, goalY, mapGrid);
            var track = this.pathers[enemyPathing.wayPointsIndex].aStar(enemyPosition);
            while (track == null) {
                var point = enemyPathing.track.shift();
                if (point == null) {
                    throw "Unexpectedly null point in enemy track";
                }
                track = this.pathers[enemyPathing.wayPointsIndex].aStar(point);
            }
            enemyPathing.track = track;
            enemyPathing.track.shift();
        }
        this.fullPath = Pathing.fullPath(this.pathers, this.wayPoints[0]);
        this.pathers[0].aStar(this.wayPoints[0]);
    }
    update() {
        this.spawnEnemies();
        this.doAttacks();
        this.updateEnemies();
        this.clearAndDrawStatic();
        this.time++;
        this.towerTimer--;
    }
    updateEnemies() {
        for (var i = 0; i < this.enemyList.length; i++) {
            var enemy = this.enemyList[i];
            var enemyPathing = enemy.pathing;
            if (enemyPathing.track.length == 0) {
                enemyPathing.wayPointsIndex = enemyPathing.wayPointsIndex + 1;
                if (enemyPathing.wayPointsIndex >= enemyPathing.wayPoints.length - 1) {
                    this.decrementLives();
                    this.destroyEnemy(enemy);
                    continue;
                }
                var currentPather = this.pathers[enemyPathing.wayPointsIndex];
                var currentWayPoint = enemyPathing.wayPoints[enemyPathing.wayPointsIndex];
                var track = currentPather.aStar(currentWayPoint);
                if (track == null) {
                    throw "Null track!";
                }
                enemyPathing.track = track;
            }
            var dx = (this.tileWidth * enemyPathing.track[0].x) - enemyPathing.position.x;
            var dy = (this.tileHeight * enemyPathing.track[0].y) - enemyPathing.position.y;
            var dist = Pathing.straightDistance(new Point(enemyPathing.position.x, enemyPathing.position.y), new Point(this.tileWidth * enemyPathing.track[0].x, this.tileHeight * enemyPathing.track[0].y));
            var speed = enemy.currentSpeed;
            if (dist < speed) {
                var a = enemyPathing.track.shift();
                if (a == null) {
                    throw "Unecpectedly undefined track!";
                }
                enemyPathing.position.x = this.tileWidth * a.x;
                enemyPathing.position.y = this.tileHeight * a.y;
            }
            else {
                enemyPathing.position.x += (dx / dist) * speed;
                enemyPathing.position.y += (dy / dist) * speed;
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
            this.tetradDoAttack(tetrad);
        }
    }
    tetradDoAttack(tetrad) {
        if (this.time % tetrad.type.attackType.attackDelay == 0) {
            for (var j = 0; j < this.enemyList.length; j++) {
                var enemy = this.enemyList[j];
                var enemyTilePosition = new Point(enemy.pathing.position.x / this.tileWidth, enemy.pathing.position.y / this.tileHeight);
                if (Pathing.straightDistance(tetrad.position, enemyTilePosition) < tetrad.type.attackType.range) {
                    this.doAttack(tetrad, enemy);
                    return;
                }
            }
        }
    }
    doAttack(tetrad, enemy) {
        tetrad.type.attackType.apply(enemy);
        if (enemy.hp <= 0) {
            this.destroyEnemy(enemy);
        }
        this.attackList.push(new Attack(tetrad, enemy.pathing.position));
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
        if (this.testPath == null) {
            throw "null testPath!";
        }
        return new Enemy(EnemyTypes[enemyTypeIndex], new PathingObject(this.wayPoints.slice(0), this.testPath, 0, new Point(0, 0)));
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
