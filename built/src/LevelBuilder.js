import { Level } from "./Level.js";
import { TilePoint } from "./TilePoint.js";
export class LevelBuilder {
    constructor() {
        this.enemySpawnPoint = new TilePoint(0, 0);
    }
    withLives(lives) {
        this.lives = lives;
        return this;
    }
    withEnemySpawnTimes(enemySpawnTimes) {
        this.enemySpawnTimes = enemySpawnTimes;
        return this;
    }
    withBoardHeight(boardHeight) {
        this.boardHeight = boardHeight;
        return this;
    }
    withBoardWidth(boardWidth) {
        this.boardWidth = boardWidth;
        return this;
    }
    withWayPoints(wayPoints) {
        this.wayPoints = wayPoints;
        return this;
    }
    withCanvas(canvas) {
        this.canvas = canvas;
        return this;
    }
    withTetradFactory(tetradFactory) {
        this.tetradFactory = tetradFactory;
        return this;
    }
    withBlackPoints(blackPoints) {
        this.blackPoints = blackPoints;
        return this;
    }
    withEnemySpawnPoint(enemySpawnPoint) {
        this.enemySpawnPoint = enemySpawnPoint;
        return this;
    }
    build() {
        return new Level(this.lives, this.enemySpawnTimes, this.boardHeight, this.boardWidth, this.wayPoints, this.canvas, this.tetradFactory, this.blackPoints, this.enemySpawnPoint);
    }
}
